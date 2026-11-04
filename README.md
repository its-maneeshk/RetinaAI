# RetinaAI

A modular React/TypeScript and Python retinal screening **research prototype**. All demo predictions are simulated, not clinically meaningful. Use synthetic, non-identifying data only. RetinaAI is not a clinically validated medical device and does not diagnose disease or recommend treatment.

## Included

- React 19, strict TypeScript, Vite, React Router, Tailwind utility styling, and reusable components under `src/`.
- Responsive overview, guided image screening, searchable/filterable/paginated history, CSV export, record details, learning center, and transparent system/model information.
- FastAPI, Pydantic, SQLAlchemy, SQLite, Pillow, NumPy, and local TensorFlow/Keras inference.
- A valid, loadable `backend/app/ml/dummy_retina_model.keras`, plus its reproducible creation script. It has **never been trained**.
- Server-side content/extension/MIME validation, 10 MB upload cap, decompression protection, dimensions, blank-image detection, brightness/blur warnings, and private UUID filenames with EXIF stripping.
- Draft analysis followed by an explicit, idempotent save operation. SQLite is the source of truth; there is no localStorage persistence or mock frontend API.
- Administrator-key-protected permanent deletion, disabled until a key is configured.
- Executable Kaggle notebook, training guide, and dataset instructions under `backend/training/`.
- Backend regression tests, production Vite build, and a full-stack Dockerfile.

## Safety and access boundaries

Every result displays the required medical disclaimer. `model_type=DEMO`, `is_demo=true`, and `dummy-v1` identify untrained inference. Demo scores are explicitly **simulated demo scores**, not clinical confidence. Trained research models are labeled separately, and their scores remain uncalibrated estimates. No random heatmaps or fabricated Grad-CAM results are shown.

This is a **shared synthetic-data demo**, not an authenticated clinical system. There is no mock login, user database, or implied clinical authorization. CORS is not authentication. Before real data or clinical deployment add real user authentication, per-role and per-record authorization, encrypted storage/backups, comprehensive audit/retention controls, upload abuse/rate limits, clinical safety assessment, independent validation, and applicable regulatory approval.

## Development environment

The v0 preview runs both registered services automatically: Vite on port 3000 and FastAPI on port 8000. Vite proxies `/api` to the Python service. For independent installation, use the project's shadcn CLI installation option or its GitHub connection to obtain the project, then follow these setup instructions in your own development environment.

Prerequisites: Node 22.12+ (Node 24 recommended), pnpm 12, Python 3.11–3.13, and a CPU-compatible TensorFlow wheel. Linux x86_64 is the tested backend environment. TensorFlow is intentionally local; no external AI provider credentials are needed.

```bash
pnpm install --frozen-lockfile
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
```

Alternatively, if `uv` is available:

```bash
uv venv backend/.venv
uv pip install --python backend/.venv/bin/python -r backend/requirements.txt
```

Create `backend/.env` from the included `.env.example` in your editor. Defaults are sufficient for synthetic demo inference. Leave `API_ADMIN_KEY` empty to keep deletion disabled; configure a strong, private key only when an authorized operator needs deletion. Do not commit environment files or share keys. The administrator key is sent only for a delete operation and is held transiently in component state, never localStorage.

Start the backend in one process:

```bash
cd backend
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

Start the frontend from the repository root in a separate process:

```bash
pnpm dev
```

Open `http://localhost:3000`. API documentation is available through the same frontend at `/api/docs`. Use the on-screen **Use a synthetic sample** action; no patient images are required. Add/keep a `SYN-` reference, acknowledge the synthetic-data notice, run analysis, and save the draft to history.

No extra UI component or charting package was introduced. Existing icons/utilities are reused; SWR provides API caching and cross-page revalidation. The inactive Next.js starter is not used; the active frontend entry is `src/main.tsx`. The existing `app/globals.css` is retained as the shared Tailwind token stylesheet.

## State and storage

Default database: `backend/data/retinaai.db` (SQLite WAL). Private images: `backend/uploads/`. Both are excluded from Git. Image filenames are server-generated, never supplied by the client or returned in public API responses. No upload directory is mounted as public static content.

The first DEMO startup optionally seeds **48 synthetic fixture records**, explicitly versioned `dummy-v1-fixture`. No image was analyzed for those fixtures, and their quality indicators are illustrative. Actual uploaded samples run the Keras pipeline and use `dummy-v1`. Set `SEED_DEMO=false` before the first startup for an empty workspace. Do not delete a populated database merely to reseed it.

Analysis stores a durable unsaved draft; history and overview include only explicitly saved records. Saving accepts only a record ID, not client-provided grades, model types, or scores. Saving twice is idempotent. Unsaved drafts older than 24 hours are cleaned up on backend startup; this is startup cleanup, not a continuously running expiration scheduler. Database metadata and image storage are separate. Permanent authorized deletion removes both the row and private image; file-removal failures require operator review. Add audited retention/backup deletion for a real deployment.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service status, model loaded/type/version, synthetic-only/deletion flags |
| GET | `/api/dashboard?days=30` | Real database aggregates and activity |
| POST | `/api/screening/analyze` | Validate image, run Keras inference, store/return a draft |
| POST | `/api/screening/save` | Save an existing server-generated draft by record ID |
| GET | `/api/screening/history` | Search, grade/quality filters, sorting, pagination |
| GET | `/api/screening/{record_id}` | A screening record and quality/model metadata |
| DELETE | `/api/screening/{record_id}` | Delete only with a valid `X-Admin-Key` |
| GET | `/api/resources/kaggle-guide` | Download the bundled training guide |

Analyze multipart fields: `image`, `case_id` (`CASE-...`), `patient_reference` (`SYN-...`), `screening_date` (ISO date), optional `age` (integer 0–120), and `eye` (`LEFT`, `RIGHT`, `UNSPECIFIED`). Supported images: JPEG/PNG/WebP; min 224×224; max 10 MB and 24 million pixels. Requests with invalid images return structured 4xx errors. Technical acceptance cannot establish that an image is retinal or clinically suitable.

Core response contract:

```json
{
  "record_id": "DR-2026-EXAMPLE",
  "predicted_grade": 2,
  "predicted_label": "Moderate DR",
  "model_score": 0.24,
  "model_version": "dummy-v1",
  "model_type": "DEMO",
  "quality_status": "ACCEPTABLE",
  "timestamp": "2026-11-03T12:00:00Z",
  "is_demo": true
}
```

The example is illustrative. The actual untrained network produces its own deterministic softmax outputs. The response also contains metadata, five scores, image dimensions, duration, save status, and quality messages. No source image is publicly served.

## Replace the model without rewriting React

The fixed input contract is float32 RGB **0–255**, center-cropped/resized to **224×224**, with normalization embedded inside the Keras model; output is **five softmax scores** in the standard class order. The training notebook preserves this contract. The loader verifies shapes, score validity, and model type compatibility, uses safe Keras deserialization, and never silently falls back to a demo when a trained artifact fails.

Put the exported artifact at `backend/app/ml/retina_dr_model.keras`, then configure:

```dotenv
MODEL_PATH=app/ml/retina_dr_model.keras
MODEL_TYPE=TRAINED
MODEL_VERSION=research-effnetb0-v1
SEED_DEMO=false
```

Restart Python and verify `/api/health` and a synthetic upload. **No frontend or API contract changes are needed.** Existing DEMO history retains its labels. Shape checks cannot prove that a model was trained or clinically validated; inspect provenance, preprocessing parity, class mapping, and evaluation independently.

Read [KAGGLE_TRAINING_GUIDE.md](backend/training/KAGGLE_TRAINING_GUIDE.md), [dataset_instructions.txt](backend/training/dataset_instructions.txt), and the executable [notebook](backend/training/model_training_template.ipynb). Training on a licensed dataset and clinical validation are deliberately not claimed as completed. Genuine trained-model Grad-CAM generation is a future authenticated backend integration; the current service returns `explainability: null`. The response schema and explanation panel already accept an optional model-version-matched `GRAD_CAM` payload with original/heatmap image data and show working view toggles only for a non-demo result with that actual data. No heatmaps are invented or sent by the demo.

Regenerate the untrained artifact if necessary:

```bash
cd backend
.venv/bin/python -m app.ml.create_dummy_model
```

## Verification

```bash
pnpm typecheck
pnpm build
cd backend
.venv/bin/python -m pytest tests -q
```

Tests use a temporary independent SQLite database/uploads directory and explicitly select the dummy artifact. They cover actual Keras inference, save idempotency, reopening the database, history/search, dashboard query parsing, invalid/blank/oversized/mismatched images, quality warnings, metadata validation, forged-save rejection, administrator deletion, private upload paths, model-type labeling, and malformed scores.

Browser checks should exercise desktop and mobile navigation; upload/sample, consent, analyze, result warnings, save, history filtering, details, delete lockout, and error recovery. Every interactive result must remain hidden until inference succeeds. An offline Python service must produce an actionable error, not a fabricated result.

## Deployment

**A full-stack RetinaAI deployment needs a persistent Python/container host and durable volumes.** TensorFlow plus SQLite/private uploads must not be placed on an ephemeral Vercel function filesystem. Publishing just the Vite frontend does not deploy this Python service.

The supplied Dockerfile builds the frontend and serves it from FastAPI on port 8000, including SPA deep-link handling. Mount durable, access-restricted volumes at `/app/backend/data` and `/app/backend/uploads`. Set frontend origins to the exact HTTPS site origin and keep private keys in the host's secret store. Back up and encrypt both data stores. The container runs as a non-root user. Reverse-proxy request-size/rate limits and HTTPS are additional deployment requirements.

Alternatively, host Python persistently and deploy the Vite frontend independently. Set the optional non-secret `VITE_API_BASE_URL` at frontend build time to `https://your-api-host/api`, and set `FRONTEND_ORIGINS` on Python to the exact frontend origin. CORS must not be opened to every host. The default relative `/api` works for Vite proxy development and the single-container deployment. `API_PROXY_TARGET` changes only the development proxy target.

The shared research prototype has no authentication or clinical RBAC. Do not process real patient data just because HTTPS, CORS, an administrator deletion key, or a trained artifact is configured.
