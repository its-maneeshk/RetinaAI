import ast
import json
from pathlib import Path
import numpy as np
import tensorflow as tf


def test_notebook_cells_parse_and_export_matches_serving_contract(tmp_path):
    path = Path(__file__).resolve().parents[1] / 'training/model_training_template.ipynb'
    notebook = json.loads(path.read_text())
    assert notebook['nbformat'] == 4
    cells = [cell for cell in notebook['cells'] if cell['cell_type'] == 'code']
    for cell in cells:
        ast.parse(''.join(cell['source']))
    architecture = next(cell for cell in cells if cell['id'] == 'architecture')
    source = ''.join(architecture['source']).replace("weights='imagenet'", 'weights=None').replace('model.summary()', '')
    namespace = {'tf': tf, 'SIZE': 224, 'SEED': 2026}
    exec(compile(source, 'notebook-architecture-check', 'exec'), namespace)
    model = namespace['model']
    assert model.input_shape == (None, 224, 224, 3)
    assert model.output_shape == (None, 5)
    batch = np.zeros((1, 224, 224, 3), dtype=np.float32)
    before = np.asarray(model(batch, training=False))
    artifact = tmp_path / 'research_architecture_test_only.keras'
    model.save(artifact)
    loaded = tf.keras.models.load_model(artifact, compile=False, safe_mode=True)
    after = np.asarray(loaded(batch, training=False))
    assert np.isfinite(after).all() and (after >= 0).all()
    np.testing.assert_allclose(after.sum(axis=1), 1, atol=0.001)
    np.testing.assert_allclose(before, after, rtol=0.0001, atol=0.00001)
