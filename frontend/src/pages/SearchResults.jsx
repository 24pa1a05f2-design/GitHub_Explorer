import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import FilterSidebar from "../components/FilterSidebar";
import Loading from "../components/Loading";
import RepoGrid from "../components/RepoGrid";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";
import { searchRepositories } from "../services/api";
import { getCreatedAfterQualifier } from "../utils/trending";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [language, setLanguage] = useState("All");
  const [topic, setTopic] = useState("All");
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [result, setResult] = useState({ repositories: [], total_count: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [query, language, topic, period, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const qualifier = getCreatedAfterQualifier(period);
    const baseQuery = query.trim() || "stars:>0";
    const searchQuery = [baseQuery, qualifier].filter(Boolean).join(" ");
    searchRepositories({ q: searchQuery, page, sort, language, topic })
      .then((data) => {
        if (active) {
          setResult(data);
          sessionStorage.setItem("github-explorer-analytics", JSON.stringify(data.repositories));
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query, page, sort, language, topic, period]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((result.total_count || 0) / 12)), [result.total_count]);
  const periodLabel = { week: "past week", month: "past month", year: "past year" }[period];
  const resultsLabel = query.trim()
    ? `Showing results for ${query}`
    : topic !== "All"
      ? `Repositories tagged ${topic}`
      : language !== "All"
        ? `Repositories written in ${language}`
        : "Explore repositories";

  function handleSearch(nextQuery) {
    if (nextQuery) navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
  }

  function clearFilters() {
    setLanguage("All");
    setTopic("All");
    setPeriod("all");
  }

  const filters = (
    <FilterSidebar
      language={language}
      topic={topic}
      period={period}
      onLanguageChange={setLanguage}
      onTopicChange={setTopic}
      onPeriodChange={setPeriod}
      onClear={clearFilters}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Repository Search</h1>
        <div className="mt-4">
          <SearchBar initialValue={query} onSearch={handleSearch} compact />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {resultsLabel}
          {periodLabel && <span> · Trending: created in the {periodLabel}, ranked by stars</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      {mobileFiltersOpen && <div className="mb-4 lg:hidden">{filters}</div>}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">{filters}</div>
        <main>
          {loading && <Loading message="Loading repositories..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && result.repositories.length === 0 && <EmptyState title="No repositories found." />}
          {!loading && !error && result.repositories.length > 0 && <RepoGrid repositories={result.repositories} />}
          {!loading && !error && result.repositories.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                {page} / {Math.min(totalPages, 84)}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || page >= 84}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
