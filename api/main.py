"""Wine-quality study assistant API for the course GenAI exercise."""

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path, override=True)

from fastapi import FastAPI, Request  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402

from gaik import __version__ as gaik_version  # noqa: E402

try:
    from routers import rag
    from utils.model_settings import ModelSettingsMiddleware
    from utils.ops import OpsMiddleware
except ImportError:
    from api.routers import rag
    from api.utils.model_settings import ModelSettingsMiddleware
    from api.utils.ops import OpsMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Wine-quality study assistant starting...")
    rag.index_corpus()
    yield
    logger.info("Wine-quality study assistant shutting down...")


app = FastAPI(
    title="Wine quality study assistant",
    description="Conversational RAG over the course wine-quality notes",
    version=gaik_version,
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ModelSettingsMiddleware)
app.add_middleware(OpsMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


app.include_router(rag.router, prefix="/rag", tags=["RAG"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "gaik-course-rag-api"}


@app.get("/")
async def root():
    return {
        "name": "Wine quality study assistant",
        "version": gaik_version,
        "docs": "/docs",
        "chat_model": rag.CHAT_MODEL,
        "embedding_model": rag.EMBEDDING_MODEL,
        "endpoints": {
            "health": "/health",
            "rag": "/rag/query - ask a question about the wine notes",
        },
    }
