FROM node:24-bookworm-slim AS frontend
WORKDIR /build
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 TF_CPP_MIN_LOG_LEVEL=2
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 && apt-get clean
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY --chown=10001:10001 backend ./backend
COPY --from=frontend --chown=10001:10001 /build/dist ./dist
RUN useradd --uid 10001 --create-home retinaai && mkdir -p backend/data backend/uploads && chown -R 10001:10001 backend/data backend/uploads
USER 10001:10001
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--app-dir", "backend", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
