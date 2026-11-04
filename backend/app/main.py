from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
import logging
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select
from app.config import settings
from app.models.database import Base, engine, SessionLocal
from app.models.screening_record import ScreeningRecord
from app.ml.model_loader import model_loader
from app.api import screening, history, dashboard
from app.services.image_service import remove_private_image
from app.services.seed_service import seed_demo_records

logger = logging.getLogger('retinaai')


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    settings.upload_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
    with SessionLocal() as db:
        cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=24)
        drafts = db.scalars(select(ScreeningRecord).where(ScreeningRecord.is_saved.is_(False), ScreeningRecord.screening_timestamp < cutoff)).all()
        for draft in drafts:
            remove_private_image(draft.image_filename)
            db.delete(draft)
        db.commit()
    model_loader.load()
    seed_demo_records()
    yield


app = FastAPI(title='RetinaAI Research API', docs_url='/api/docs', redoc_url='/api/redoc', openapi_url='/api/openapi.json', version='1.0.0', description='Synthetic-data-only screening research prototype. DEMO outputs are simulated, not medical findings.', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=list(settings.frontend_origins), allow_credentials=False, allow_methods=['GET', 'POST', 'DELETE'], allow_headers=['Content-Type', 'X-Admin-Key'])


@app.middleware('http')
async def safety_headers(request: Request, call_next):
    length = request.headers.get('content-length', '')
    if length.isdigit() and int(length) > settings.max_image_bytes + 1024 * 1024:
        return JSONResponse(status_code=413, content={'detail': 'The request exceeds the upload size limit.'})
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    if request.url.scheme == 'https' or request.headers.get('x-forwarded-proto') == 'https':
        response.headers['Strict-Transport-Security'] = 'max-age=63072000'
    if request.url.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response


@app.exception_handler(Exception)
async def safe_error(_request: Request, _exception: Exception):
    logger.error('A backend operation failed; request and patient details are not logged.')
    return JSONResponse(status_code=500, content={'detail': 'The screening service could not complete this request safely. Please try again.'})


@app.get('/api/health')
def health():
    return {'status': 'ok' if model_loader.model is not None else 'degraded', 'model_loaded': model_loader.model is not None, 'model_type': settings.model_type, 'model_version': settings.model_version, 'deletion_enabled': bool(settings.admin_api_key), 'synthetic_only': True}


@app.get('/api/resources/kaggle-guide', include_in_schema=False)
def training_guide():
    return FileResponse(Path(__file__).resolve().parents[1] / 'training' / 'KAGGLE_TRAINING_GUIDE.md', media_type='text/markdown', filename='KAGGLE_TRAINING_GUIDE.md')


app.include_router(screening.router)
app.include_router(history.router)
app.include_router(dashboard.router)


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as error:
            if error.status_code == 404 and not path.startswith('api/') and '.' not in Path(path).name:
                return await super().get_response('index.html', scope)
            raise


frontend_dist = Path(__file__).resolve().parents[2] / 'dist'
if frontend_dist.is_dir():
    app.mount('/', SPAStaticFiles(directory=frontend_dist, html=True), name='frontend')
