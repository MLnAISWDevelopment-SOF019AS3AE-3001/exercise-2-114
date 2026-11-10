#!/usr/bin/env python3
"""Check the Exercise 2 repository shape. Does not call the cloud vendor AI API service."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROMPT_FILE = ROOT / "api" / "routers" / "rag.py"
CHAT_MODEL = "google/gemma-4-31b-it"
EMBEDDING_MODEL = "lightonai/modernbert-embed-large"
BASELINE_MARKER = "Baseline run. Prompt and model settings are unchanged."
SKIP_DIRS = {".git", "node_modules", ".next", ".venv", "vendor"}
SKIP_SUFFIXES = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".pdf",
    ".mp3",
    ".mp4",
    ".m4a",
    ".zip",
    ".xlsx",
    ".woff",
    ".woff2",
}


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_prompt() -> None:
    if not PROMPT_FILE.is_file():
        fail(f"Missing {PROMPT_FILE.relative_to(ROOT)}")
    text = read_text(PROMPT_FILE)
    if "CUSTOM_RAG_PROMPT" not in text:
        fail("api/routers/rag.py does not define CUSTOM_RAG_PROMPT")
    if CHAT_MODEL not in text or EMBEDDING_MODEL not in text:
        fail("api/routers/rag.py does not keep both pinned model ids")


def check_optional_submissions() -> None:
    baseline = ROOT / "BASELINE.md"
    if baseline.is_file() and BASELINE_MARKER not in read_text(baseline):
        fail("BASELINE.md does not contain the baseline marker")
    deployment = ROOT / "deployment.txt"
    if deployment.is_file():
        line = read_text(deployment).strip()
        host = line.removeprefix("https://")
        if not line.startswith("https://") or not host or "/" in host:
            fail("deployment.txt must be one https URL with no path")
    comparison = ROOT / "comparison.md"
    if comparison.is_file():
        folded = read_text(comparison).lower()
        if "baseline" not in folded or "modified" not in folded:
            fail("comparison.md must mention baseline and modified")
    for name in ("baseline-answer.md", "modified-answer.md"):
        path = ROOT / name
        if path.is_file() and not read_text(path).strip():
            fail(f"{name} is empty")


def check_secrets() -> None:
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in SKIP_SUFFIXES:
            continue
        if path.name == "secrets.yaml":
            fail(f"Do not commit {path.relative_to(ROOT)}")
        if path.stat().st_size > 1_000_000:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for line in text.splitlines():
            if "AITTA_API_KEY" not in line and "COURSE_PASSWORD" not in line:
                continue
            if any(
                marker in line
                for marker in (
                    "secretKeyRef",
                    "valueFrom",
                    "getenv",
                    "environ",
                    "process.env",
                    "<token",
                    "<password",
                    "your-csc-aitta-token",
                    "your-course-password",
                )
            ):
                continue
            if line.strip().endswith(': ""') or line.strip().endswith(": ''"):
                continue
            # A filled assignment is a committed secret. Placeholders and references are allowed above.
            if "=" in line:
                value = line.split("=", 1)[1].strip().strip("\"'")
                if value and not value.startswith("$"):
                    fail(f"Possible course secret in {path.relative_to(ROOT)}")


def main() -> None:
    check_prompt()
    check_optional_submissions()
    check_secrets()
    print("Exercise 2 repository check passed")


if __name__ == "__main__":
    main()
