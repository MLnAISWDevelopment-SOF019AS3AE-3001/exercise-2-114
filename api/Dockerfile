# Wine-quality study assistant API.
# Build context: the course-rag-webapp directory (the student repository root).

FROM python:3.12-slim

LABEL description="Wine quality study assistant API"

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

COPY api/requirements.txt .

# CPU torch first so gaik[rag-workflow] does not pull a CUDA wheel.
RUN uv pip install --system --no-cache \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    torch torchvision

RUN uv pip install --system --no-cache -r requirements.txt

COPY api/ .

RUN useradd -u 1001 -g 0 -d /app -s /sbin/nologin appuser && \
    mkdir -p /app/.cache && \
    chgrp -R 0 /app && chmod -R g=u /app

ENV HOME=/app
ENV HF_HOME=/app/.cache

USER 1001

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
