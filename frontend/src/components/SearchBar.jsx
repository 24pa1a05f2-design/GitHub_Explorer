import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ initialValue = "", onSearch, compact = false }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full gap-2 ${compact ? "" : "max-w-3xl"}`}>
      <label className="sr-only" htmlFor="repository-search">
        Search repositories
      </label>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="repository-search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search open-source repositories"
          className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-slate-950 shadow-sm focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
      >
        Search
      </button>
    </form>
  );
}

