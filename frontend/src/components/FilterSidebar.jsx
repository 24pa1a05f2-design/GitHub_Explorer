const languages = ["All", "JavaScript", "Python", "Java", "TypeScript", "C++", "C#", "Go", "Rust", "Dart"];
const topics = ["All", "AI", "Machine Learning", "Web", "Frontend", "Backend", "Mobile", "DevOps", "Open Source", "Data Science"];
const periods = [
  { value: "all", label: "Any time" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
  { value: "year", label: "Past year" }
];

export default function FilterSidebar({ language, topic, period, onLanguageChange, onTopicChange, onPeriodChange, onClear }) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-950 dark:text-white">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
          Clear Filters
        </button>
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="language-filter">
        Language
      </label>
      <select
        id="language-filter"
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {languages.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="topic-filter">
        Topic
      </label>
      <select
        id="topic-filter"
        value={topic}
        onChange={(event) => onTopicChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {topics.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="trending-period-filter">
        Created within
      </label>
      <select
        id="trending-period-filter"
        value={period}
        onChange={(event) => onPeriodChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {periods.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    </aside>
  );
}
