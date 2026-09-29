import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { addBookmark, isBookmarked, removeBookmark } from "../utils/storage";

export default function BookmarkButton({ repo, onChange }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(repo.fullName));
  }, [repo.fullName]);

  function toggleBookmark() {
    if (bookmarked) {
      removeBookmark(repo.fullName);
      setBookmarked(false);
      onChange?.(false);
    } else {
      addBookmark(repo);
      setBookmarked(true);
      onChange?.(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
        bookmarked
          ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
      aria-pressed={bookmarked}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      {bookmarked ? "Saved" : "Bookmark"}
    </button>
  );
}

