export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const unconfigured = error === "unconfigured";
  const rejected = error === "1";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <form
        action="/api/login"
        method="post"
        className="bg-card space-y-4 rounded-3xl border p-8 shadow-sm"
      >
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Wine quality study assistant
          </h1>
          <p className="text-muted-foreground">
            Enter the password given in class. The chat stays closed without it.
          </p>
        </div>
        {unconfigured && (
          <p className="text-destructive">
            This deployment has no course password yet. Set COURSE_PASSWORD in
            the Rahti secret and redeploy.
          </p>
        )}
        {rejected && (
          <p className="text-destructive">That password was not accepted.</p>
        )}
        <label className="block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={unconfigured}
          className="border-input bg-background w-full rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={unconfigured}
          className="bg-primary text-primary-foreground h-10 rounded-md px-4 text-sm font-medium disabled:opacity-60"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
