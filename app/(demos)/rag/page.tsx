"use client";

import { FormEvent, useState } from "react";

type Source = {
  document_name: string;
  page_number: number | null;
  relevance_score: number | null;
};

type Turn = {
  question: string;
  answer: string;
  sources: Source[];
  error?: string;
};

const FIXED_QUESTION =
  "What does residual sugar measure, and is it the same thing as the quality score?";

export default function ChatPage() {
  const [question, setQuestion] = useState(FIXED_QUESTION);
  const [pending, setPending] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (!text || pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const detail =
          typeof payload?.detail === "string"
            ? payload.detail
            : "The assistant could not answer.";
        setTurns((current) => [
          ...current,
          { question: text, answer: "", sources: [], error: detail },
        ]);
        return;
      }
      setTurns((current) => [
        ...current,
        {
          question: text,
          answer: payload.answer ?? "",
          sources: payload.sources ?? [],
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed";
      setTurns((current) => [
        ...current,
        { question: text, answer: "", sources: [], error: message },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Chat</h1>
        <p className="text-muted-foreground">
          Ask about the wine notes. The first answer can wait while the language
          model starts. Save the reply for the exercise before you change the prompt.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium" htmlFor="question">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          className="border-input bg-card w-full rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-foreground h-10 rounded-md px-4 text-sm font-medium disabled:opacity-60"
        >
          {pending ? "Waiting for the answer…" : "Ask"}
        </button>
      </form>
      <ol className="space-y-4">
        {turns.map((turn, index) => (
          <li key={`${turn.question}-${index}`} className="bg-card space-y-3 rounded-2xl border p-5">
            <p className="font-medium">{turn.question}</p>
            {turn.error ? (
              <p className="text-destructive">{turn.error}</p>
            ) : (
              <p className="whitespace-pre-wrap">{turn.answer}</p>
            )}
            {turn.sources.length > 0 && (
              <ul className="text-muted-foreground text-sm">
                {turn.sources.map((source) => (
                  <li key={`${source.document_name}-${source.page_number}`}>
                    [{source.document_name}, page {source.page_number}]
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
