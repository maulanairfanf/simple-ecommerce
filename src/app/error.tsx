"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <p>We could not bring the counter into view.</p>
      <button onClick={reset} type="button">
        Try the page again
      </button>
    </main>
  );
}
