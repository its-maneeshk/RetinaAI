# RetinaAI Python backend

FastAPI + TensorFlow/Keras + Pillow + Pydantic + SQLAlchemy/SQLite. This is a synthetic-data-only research prototype, not a diagnostic service.

## Setup

From this directory in an independent development environment:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

Copy `.env.example` to `.env` in your editor for optional configuration. Defaults load `app/ml/dummy_retina_model.keras`, label it DEMO/dummy-v1, create `data/retinaai.db`, and retain private re-encoded images in `uploads/`. These directories must live on persistent storage and must never be committed or served as public static files.

The valid `.keras` artifact is included. Recreate it with `.venv/bin/python -m app.ml.create_dummy_model` if needed. It is an untrained network, never a trained DR detector. Every softmax output is simulated and has no clinical meaning. The loader refuses a type/identity mismatch, incompatible shapes, or malformed scores; it does not downgrade failed trained inference to DEMO silently.

The first DEMO startup optionally creates 48 clearly versioned synthetic example records (`dummy-v1-fixture`), which are not real inference results. Configure `SEED_DEMO=false` for an initially empty database. Startup cleanup removes unsaved drafts older than 24 hours.

## API and frontend

- Health: `/api/health`
- Interactive documentation: `/api/docs`
- OpenAPI: `/api/openapi.json`
- Analyze: `POST /api/screening/analyze` (multipart image and synthetic case metadata)
- Save: `POST /api/screening/save` with `{ "record_id": "..." }`
- History: `GET /api/screening/history`
- Details/delete: `/api/screening/{record_id}`

Vite on port 3000 proxies `/api` to this service. CORS permits only configured frontend origins; CORS is not authentication. `API_ADMIN_KEY` is required for deletion via `X-Admin-Key`. With no key, deletion is disabled, not anonymously authorized. API errors do not expose filesystem paths or echo image/patient content. Access logging is disabled in the startup recipe to avoid retaining searchable references in URLs. Add appropriate privacy-reviewed observability before production use.

## Model replacement

Read `training/KAGGLE_TRAINING_GUIDE.md`. The contract is raw RGB float32 0–255, EXIF-oriented, center-square crop and LANCZOS resize to 224×224, with normalization inside the model, yielding five softmax scores. Export `retina_dr_model.keras`, set MODEL_PATH, MODEL_TYPE=TRAINED, and a distinct MODEL_VERSION, disable seeding, restart, and verify health/inference. React consumes the same response contract automatically. A trained research model still is not a validated medical device.

## Tests

```bash
.venv/bin/python -m pytest tests -q
```

Tests use a separate temporary SQLite database and image folder; they never mutate workspace records. See the root README for the complete stack, architecture, security boundaries, deployment prerequisites, and documentation. Full deployment requires a persistent Python/container host and persistent volumes; ephemeral Vercel storage is not suitable for SQLite or private images. Authentication, role-based access, encryption, auditing, abuse limits, and clinical/regulatory review remain prerequisites for any real data.
