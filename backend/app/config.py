import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / '.env')
os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')
os.environ.setdefault('TF_NUM_INTRAOP_THREADS', '2')
os.environ.setdefault('TF_NUM_INTEROP_THREADS', '2')


def resolve_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else BASE_DIR / path


@dataclass
class Settings:
    model_type: str = os.getenv('MODEL_TYPE', 'DEMO').upper()
    model_version: str = os.getenv('MODEL_VERSION', 'dummy-v1')
    model_path: Path = resolve_path(os.getenv('MODEL_PATH', 'app/ml/dummy_retina_model.keras'))
    database_url: str = os.getenv('DATABASE_URL', f'sqlite:///{BASE_DIR / "data/retinaai.db"}')
    upload_dir: Path = resolve_path(os.getenv('UPLOAD_DIR', 'uploads'))
    frontend_origins: tuple[str, ...] = tuple(origin.strip() for origin in os.getenv('FRONTEND_ORIGINS', 'http://localhost:3000,https://retinaai-development.v0.build').split(',') if origin.strip())
    admin_api_key: str = os.getenv('API_ADMIN_KEY', '')
    seed_demo: bool = os.getenv('SEED_DEMO', 'true').lower() == 'true'
    max_image_bytes: int = 10 * 1024 * 1024
    max_image_pixels: int = 24_000_000
    input_size: int = 224


settings = Settings()
if settings.model_type not in {'DEMO', 'TRAINED'}:
    raise ValueError('MODEL_TYPE must be DEMO or TRAINED.')
if settings.model_type == 'TRAINED' and settings.model_version == 'dummy-v1':
    raise ValueError('Set a distinct MODEL_VERSION for a trained research model.')
