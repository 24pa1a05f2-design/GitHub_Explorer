export default function StatsCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon && <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />}
      </div>
    </div>
  );
}

