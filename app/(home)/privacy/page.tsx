import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this course assistant stores.",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-4">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Privacy</h1>
      <p>
        The chat asks for the password given in class. There is no personal
        account. The wine notes shipped with the application are course material
        about a public dataset. Do not type personal data into the chat. Questions
        are sent to the cloud vendor AI API service to produce an answer.
        This term that service is CSC Aitta.
      </p>
      <Link href="/" className="underline-offset-4 hover:underline">
        Back to home
      </Link>
    </article>
  );
}
