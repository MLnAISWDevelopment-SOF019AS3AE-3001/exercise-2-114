"""The shipped wine notes and the pinned models are the Exercise 2 baseline."""

from api.routers import rag

REQUIRED_PARAGRAPH = (
    'Begin every answer with "Wine notes:". Cite a source as (source: DOCUMENT, page N). '
    'If the notes do not contain the answer, say "Not in the wine notes." '
    "Do not estimate a quality score."
)


def test_baseline_prompt_does_not_contain_the_required_paragraph():
    assert "CUSTOM_RAG_PROMPT" in rag.__dict__
    assert REQUIRED_PARAGRAPH not in rag.CUSTOM_RAG_PROMPT
    assert "[document_name, page X]" in rag.CUSTOM_RAG_PROMPT


def test_models_stay_pinned():
    assert rag.CHAT_MODEL == "google/gemma-4-31b-it"
    assert rag.EMBEDDING_MODEL == "lightonai/modernbert-embed-large"
    assert rag.AITTA_BASE_URL == "https://aitta-api.csc.fi/openai/v1"


def test_corpus_defines_residual_sugar_apart_from_quality():
    sections = rag.load_corpus_sections()
    sugar = [
        section
        for section in sections
        if section["document_name"] == "measurements" and section["heading"] == "Residual sugar"
    ]
    assert len(sugar) == 1
    assert "grams per litre" in sugar[0]["text"]
    assert "not the same thing as the quality score" in sugar[0]["text"]
    assert any(section["document_name"] == "dataset" for section in sections)
    assert any(section["document_name"] == "examples" for section in sections)


def test_workflow_builder_pins_the_embedding_model():
    from unittest.mock import patch

    with (
        patch("gaik.software_components.RAG.answer_generator.AnswerGenerator"),
        patch("gaik.software_components.RAG.vector_store.VectorStore"),
        patch("gaik.software_components.RAG.embedder.Embedder") as embedder,
    ):
        rag.build_workflow(
            {
                "provider": "aitta",
                "model": "other-chat",
                "embedding_model": "other-embedding",
                "api_key": "test",
                "base_url": rag.AITTA_BASE_URL,
            }
        )
    assert embedder.call_args.kwargs["model"] == rag.EMBEDDING_MODEL
    assert embedder.call_args.kwargs["config"]["model"] == rag.CHAT_MODEL
