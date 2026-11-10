import Link from "next/link";
import type { ReactNode } from "react";

export function CourseShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
            Wine quality study assistant
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/rag" className="text-sm underline-offset-4 hover:underline">
              Chat
            </Link>
            <form action="/api/logout" method="post">
              <button type="submit" className="text-sm underline-offset-4 hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
