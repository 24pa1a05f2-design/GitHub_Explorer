import { ExternalLink, GitFork, Star, CircleDot, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import BookmarkButton from "./BookmarkButton";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "Unknown";
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value || 0);
}

export default function RepoCard({ repo, onBookmarkChange }) {
  const [owner, name] = repo.fullName.split("/");

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <img src={repo.owner.avatarUrl} alt={`${repo.owner.login} avatar`} className="h-10 w-10 rounded-md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-950 dark:text-white">{repo.name}</h3>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{repo.owner.login}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-700 dark:text-slate-300">
        {repo.description || "No description provided."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {repo.language && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {repo.language}
          </span>
        )}
        {repo.topics?.slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {topic}
          </span>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-4">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4" />
          <dt className="sr-only">Stars</dt>
          <dd>{formatNumber(repo.stars)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <GitFork className="h-4 w-4" />
          <dt className="sr-only">Forks</dt>
          <dd>{formatNumber(repo.forks)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleDot className="h-4 w-4" />
          <dt className="sr-only">Open issues</dt>
          <dd>{formatNumber(repo.openIssues)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <dt className="sr-only">Updated</dt>
          <dd>{formatDate(repo.updatedAt)}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/repository/${owner}/${name}`}
          className="inline-flex items-center rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
        >
          View details
        </Link>
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ExternalLink className="h-4 w-4" />
          View on GitHub
        </a>
        <BookmarkButton repo={repo} onChange={onBookmarkChange} />
      </div>
    </article>
  );
}

