import { BarChart3, BookMarked, Code2, GitFork, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import RepoGrid from "../components/RepoGrid";
import SearchBar from "../components/SearchBar";
import StatsCard from "../components/StatsCard";
import { searchRepositories } from "../services/api";
import { getBookmarks } from "../utils/storage";
import { getCreatedAfterQualifier } from "../utils/trending";

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(getBookmarks().length);

  useEffect(() => {
    let active = true;
    setLoading(true);
    searchRepositories({ q: `stars:>0 ${getCreatedAfterQualifier("month")}`, perPage: 9, sort: "stars" })
      .then((data) => {
        if (active) {
          setRepositories(data.repositories);
          sessionStorage.setItem("github-explorer-analytics", JSON.stringify(data.repositories));
          setError("");
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
    const languages = new Set(repositories.map((repo) => repo.language).filter(Boolean));
    return { totalStars, totalForks, languages: languages.size };
  }, [repositories]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Explore Open Source Projects</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Discover, analyze, and bookmark interesting open-source projects from GitHub.
          </p>
          <div className="mt-6">
            <SearchBar onSearch={(query) => query && navigate(`/search?q=${encodeURIComponent(query)}`)} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Analytics Preview</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Charts use repositories returned by your searches or dashboard data. Historical activity data is not available from the current GitHub API data.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Trending Repos" value={repositories.length} icon={Code2} />
        <StatsCard label="Stars Tracked" value={Intl.NumberFormat("en", { notation: "compact" }).format(stats.totalStars)} icon={Star} />
        <StatsCard label="Forks Tracked" value={Intl.NumberFormat("en", { notation: "compact" }).format(stats.totalForks)} icon={GitFork} />
        <StatsCard label="Bookmarks" value={bookmarkCount} icon={BookMarked} />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Trending repositories</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">New projects from the past month, ranked by stars.</p>
          </div>
        </div>
        {loading && <Loading message="Loading repositories..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && repositories.length === 0 && <EmptyState title="No repositories found." />}
        {!loading && !error && repositories.length > 0 && (
          <RepoGrid repositories={repositories} onBookmarkChange={() => setBookmarkCount(getBookmarks().length)} />
        )}
      </section>
    </div>
  );
}
