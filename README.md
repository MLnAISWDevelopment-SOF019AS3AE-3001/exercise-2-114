# Wine quality study assistant

Course copy of the GAIK demo, reduced to conversational RAG. The full demo in `toolkit_demo_app` is unchanged.

The assistant answers questions from the Markdown notes in `api/corpus/`. Those notes describe the wine-quality measurements used in Exercise 1, including residual sugar and the sensory quality score. The chat cites a note. It does not estimate a quality score.

The notes describe the Wine Quality dataset donated by P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis. Cortez, P., Cerdeira, A., Almeida, F., Matos, T., and Reis, J. (2009). Wine Quality [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C56S3T. Licensed under CC BY 4.0. This course is not affiliated with the donors. The donors ask for this citation when the tables are used: P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis. Modeling wine preferences by data mining from physicochemical properties. Decision Support Systems, 47(4):547–553, 2009.

Models, both pinned in `api/routers/rag.py`:

- Chat: `google/gemma-4-31b-it`
- Embeddings: `lightonai/modernbert-embed-large`
- API: `https://aitta-api.csc.fi/openai/v1`

## Run locally

Put the class API token in `.env.local` (see `.env.example`). This term the cloud vendor AI API service is CSC Aitta. From this directory:

```bash
bun install
bun run dev:all
```

The site is on port 3000. The API is on port 8000 and is proxied at `/api`. Open the site, enter `COURSE_PASSWORD`, then open `/rag`. `/api/health` stays open. The chat does not.

The first question can wait while the cloud vendor AI API service loads the chat model. `/api/health` only means the API process is up.

## Deploy

See [openshift/README.md](openshift/README.md). Apply those manifests in your own Rahti project. Do not use the `gaik` project or `gaik-demo.2.rahtiapp.fi`.

## Branch

`main` is the ready application, shared by the class. Create `exercise-2-<id>` from `main` and do the exercise on that branch. Do not commit on `main`.

## What students change

After a baseline answer is saved, change the required paragraph from the exercise page in your own words and put that wording into `CUSTOM_RAG_PROMPT` in `api/routers/rag.py`. Do not commit the paragraph unchanged. The changed prompt has to be your own original version. A copy of another student's prompt is not allowed. The 4 points for the required modification require that original version. Leave both model ids as they are.
