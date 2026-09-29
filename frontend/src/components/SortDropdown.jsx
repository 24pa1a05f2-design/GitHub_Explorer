const options = [
  { value: "stars", label: "Most Stars" },
  { value: "forks", label: "Most Forks" },
  { value: "issues", label: "Most Issues" },
  { value: "updated", label: "Recently Updated" }
];

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      Sort
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

