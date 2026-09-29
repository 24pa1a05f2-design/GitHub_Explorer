import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import RepoGrid from "../components/RepoGrid";
import SearchBar from "../components/SearchBar";
import { getBookmarks } from "../utils/storage";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(getBookmarks());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return bookmarks.filter((repo) => `${repo.fullName} ${repo.description || ""} ${repo.language || ""}`.toLowerCase().includes(lower));
  }, [bookmarks, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Bookmarked Repositories</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Keep track of repositories you want to revisit.</p>
        <div className="mt-4">
          <SearchBar initialValue="" onSearch={setQuery} compact />
        </div>
      </div>
      {bookmarks.length === 0 && <EmptyState title="You haven't bookmarked any repositories yet." />}
      {bookmarks.length > 0 && filtered.length === 0 && <EmptyState title="No matching bookmarks found." />}
      {filtered.length > 0 && <RepoGrid repositories={filtered} onBookmarkChange={() => setBookmarks(getBookmarks())} />}
    </div>
  );
}

