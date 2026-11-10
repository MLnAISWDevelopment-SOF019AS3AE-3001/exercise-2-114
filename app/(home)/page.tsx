import Link from "next/link";

export default function HomePage() {
  return (
    <section className="bg-card space-y-6 rounded-3xl border p-8 shadow-sm md:p-12">
      <div className="space-y-3">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Wine quality study assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          This assistant answers questions from a small library of notes about the
          wine-quality data used in Exercise 1. The notes define each laboratory
          measurement and the sensory quality score. The assistant cites the note
          it used. It does not estimate a quality score.
        </p>
      </div>
      <p className="text-muted-foreground">
        The notes are indexed when the API starts. A later exercise adds one tool
        that calls the quality model trained in Exercise 1. This version has no
        such tool.
      </p>
      <Link
        href="/rag"
        className="bg-primary text-primary-foreground inline-flex h-12 items-center rounded-md px-6 text-base font-medium"
      >
        Open the chat
      </Link>
    </section>
  );
}
