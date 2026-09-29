export default function Loading({ message = "Loading..." }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" role="status">
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

