import os
import tempfile
from datetime import date
from io import BytesIO
from pathlib import Path

_test_directory = tempfile.TemporaryDirectory(prefix='retinaai-tests-')
os.environ['DATABASE_URL'] = f'sqlite:///{_test_directory.name}/tests.db'
os.environ['UPLOAD_DIR'] = f'{_test_directory.name}/uploads'
os.environ['SEED_DEMO'] = 'false'
os.environ['MODEL_TYPE'] = 'DEMO'
os.environ['MODEL_VERSION'] = 'dummy-v1'
os.environ['MODEL_PATH'] = str(Path(__file__).resolve().parents[1] / 'app/ml/dummy_retina_model.keras')

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app.config import settings
from app.models.database import engine, SessionLocal
from app.models.screening_record import ScreeningRecord
from app.ml.model_loader import ModelLoader, model_loader
from sqlalchemy import select


@pytest.fixture(scope='module')
def client():
    with TestClient(app) as instance:
        yield instance


def image_bytes(kind='PNG', size=(300, 300)):
    pixels = np.random.default_rng(2026).integers(35, 190, (*size[::-1], 3), dtype=np.uint8)
    image = Image.fromarray(pixels)
    output = BytesIO()
    image.save(output, format=kind)
    return output.getvalue()


def metadata():
    return {'case_id': 'CASE-TEST-01', 'patient_reference': 'SYN-TEST-01', 'screening_date': date.today().isoformat(), 'eye': 'LEFT', 'age': '46'}


def analyze(client, data=None, filename='retina.png', content_type='image/png', fields=None):
    return client.post('/api/screening/analyze', data=fields or metadata(), files={'image': (filename, data if data is not None else image_bytes(), content_type)})


def test_health_and_valid_loadable_artifact(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['model_loaded'] is True
    assert response.json()['model_type'] == 'DEMO'
    assert settings.model_path.is_file()
    assert model_loader.model.name == 'retinaai_demo_untrained'


def test_complete_inference_save_details_and_persistence(client):
    response = analyze(client)
    assert response.status_code == 200, response.text
    result = response.json()
    assert result['is_demo'] and result['model_type'] == 'DEMO'
    assert result['explainability'] is None
    assert not result['is_saved']
    assert result['model_version'] == 'dummy-v1'
    assert len(result['probabilities']) == 5
    assert abs(sum(result['probabilities']) - 1) < 0.001
    assert 0 <= result['predicted_grade'] <= 4
    assert result['image_available'] and result['analysis_ms'] > 0
    assert 'image_filename' not in result
    assert client.get('/api/screening/history').json()['total'] == 0
    saved = client.post('/api/screening/save', json={'record_id': result['record_id']})
    assert saved.status_code == 200 and saved.json()['is_saved']
    assert client.post('/api/screening/save', json={'record_id': result['record_id']}).status_code == 200
    engine.dispose()
    persisted = client.get(f'/api/screening/{result["record_id"]}').json()
    assert persisted['is_saved'] and persisted['predicted_grade'] == result['predicted_grade']
    assert client.get('/api/screening/history?search=SYN-TEST-01').json()['total'] == 1
    assert client.get('/api/screening/history?search=not-here').json()['total'] == 0
    assert client.get('/api/screening/history?search=%25').json()['total'] == 0


@pytest.mark.parametrize('days', [7, 30])
def test_dashboard_query_parsing(client, days):
    response = client.get(f'/api/dashboard?days={days}')
    assert response.status_code == 200
    assert len(response.json()['activity']) == days
    assert len(response.json()['distribution']) == 5


@pytest.mark.parametrize('payload,name,mime,status', [
    (b'not an image', 'retina.png', 'image/png', 422),
    (b'', 'retina.png', 'image/png', 422),
    (b'test', 'retina.exe', 'application/octet-stream', 415),
    (image_bytes(), 'retina.jpg', 'image/jpeg', 415),
    (image_bytes(), 'retina.png', 'image/jpeg', 415),
    (image_bytes(size=(100, 100)), 'retina.png', 'image/png', 422),
    (b'x' * (10 * 1024 * 1024 + 1), 'retina.png', 'image/png', 413),
])
def test_reject_invalid_uploads(client, payload, name, mime, status):
    assert analyze(client, payload, name, mime).status_code == status


def test_reject_blank_image(client):
    output = BytesIO()
    Image.new('RGB', (256, 256), 'black').save(output, format='PNG')
    response = analyze(client, output.getvalue())
    assert response.status_code == 422 and 'blank' in response.json()['detail']


def test_dark_textured_image_gets_warning(client):
    pixels = np.random.default_rng(4).integers(0, 20, (256, 256, 3), dtype=np.uint8)
    output = BytesIO()
    Image.fromarray(pixels).save(output, format='PNG')
    response = analyze(client, output.getvalue())
    assert response.status_code == 200
    assert response.json()['quality_status'] == 'WARNING'


@pytest.mark.parametrize('field,value', [('patient_reference', 'Real Patient Name'), ('age', '121'), ('age', '4.5'), ('case_id', '../../secret'), ('eye', 'INVALID')])
def test_metadata_validation(client, field, value):
    fields = metadata()
    fields[field] = value
    assert analyze(client, fields=fields).status_code == 422


def test_save_does_not_trust_client_predictions(client):
    response = client.post('/api/screening/save', json={'record_id': 'DR-2026-TEST', 'predicted_grade': 4, 'model_type': 'TRAINED'})
    assert response.status_code == 422
    assert client.post('/api/screening/save', json={'record_id': 'DR-2026-MISSING'}).status_code == 404


def test_deletion_requires_authorization_and_removes_private_image(client, monkeypatch):
    result = analyze(client).json()
    record_id = result['record_id']
    with SessionLocal() as db:
        row = db.scalar(select(ScreeningRecord).where(ScreeningRecord.record_id == record_id))
        image_path = settings.upload_dir / row.image_filename
    assert image_path.is_file()
    monkeypatch.setattr(settings, 'admin_api_key', '')
    assert client.delete(f'/api/screening/{record_id}').status_code == 403
    monkeypatch.setattr(settings, 'admin_api_key', 'test-only-private-key')
    assert client.delete(f'/api/screening/{record_id}', headers={'X-Admin-Key': 'wrong'}).status_code == 403
    assert client.delete(f'/api/screening/{record_id}', headers={'X-Admin-Key': 'test-only-private-key'}).status_code == 204
    assert not image_path.exists()
    assert client.get(f'/api/screening/{record_id}').status_code == 404


def test_uploaded_files_are_not_public(client):
    assert client.get('/uploads/test.jpg').status_code == 404


def test_model_type_cannot_mislabel_dummy_as_trained(client, monkeypatch):
    monkeypatch.setattr(settings, 'model_type', 'TRAINED')
    loader = ModelLoader()
    loader.load()
    assert loader.model is None and loader.load_error is not None


def test_invalid_softmax_rejected():
    for scores in [np.zeros(5), np.array([np.nan] * 5), np.array([1, 0, 0]), np.array([2, 0, 0, 0, -1])]:
        with pytest.raises(ValueError):
            ModelLoader.validate_scores(scores)


def test_unavailable_model_returns_no_prediction(client, monkeypatch):
    monkeypatch.setattr(model_loader, 'model', None)
    response = analyze(client)
    assert response.status_code == 503
    assert 'predicted_grade' not in response.json()
    assert client.get('/api/health').json()['model_loaded'] is False


def test_cors_is_restricted_to_configured_origins(client):
    allowed = client.options('/api/screening/analyze', headers={'Origin': 'http://localhost:3000', 'Access-Control-Request-Method': 'POST'})
    assert allowed.headers.get('access-control-allow-origin') == 'http://localhost:3000'
    denied = client.options('/api/screening/analyze', headers={'Origin': 'https://untrusted.example', 'Access-Control-Request-Method': 'POST'})
    assert 'access-control-allow-origin' not in denied.headers


def test_api_error_and_security_headers(client):
    response = client.get('/api/screening/DR-2026-MISSING')
    assert response.status_code == 404
    assert response.headers['x-content-type-options'] == 'nosniff'
    assert response.headers['cache-control'] == 'no-store'
    assert str(settings.upload_dir) not in response.text
