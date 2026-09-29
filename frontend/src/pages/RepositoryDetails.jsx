import { ExternalLink, GitBranch, GitFork, Scale, Star, Watch } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookmarkButton from "../components/BookmarkButton";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NoteBox from "../components/NoteBox";
import StatsCard from "../components/StatsCard";
import { getRepository, getRepositoryIssues, getRepositoryLanguages } from "../services/api";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(value)) : "Unknown";
}

export default function RepositoryDetails() {
  const { owner, repo } = useParams();
  const [repository, setRepository] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([getRepository(owner, repo), getRepositoryLanguages(owner, repo), getRepositoryIssues(owner, repo)])
      .then(([repositoryData, languageData, issueData]) => {
        if (active) {
          setRepository(repositoryData);
          setLanguages(languageData.languages);
          setIssues(issueData.issues);
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Loading message="Loading repository details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src={repository.owner.avatarUrl} alt={`${repository.owner.login} avatar`} className="h-12 w-12 rounded-md" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{repository.owner.login}</p>
                <h1 className="text-3xl font-bold text-slate-950 dark:text-white">{repository.name}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">{repository.description || "No description provided."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={repository.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
            >
              <ExternalLink className="h-4 w-4" />
              Open on GitHub
            </a>
            <BookmarkButton repo={repository} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {repository.topics?.map((topic) => (
            <span key={topic} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Stars" value={repository.stars.toLocaleString()} icon={Star} />
        <StatsCard label="Forks" value={repository.forks.toLocaleString()} icon={GitFork} />
        <StatsCard label="Watchers" value={repository.watchers.toLocaleString()} icon={Watch} />
        <StatsCard label="Open Issues" value={repository.openIssues.toLocaleString()} icon={GitBranch} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Repository Info</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-slate-500">Homepage</dt><dd className="break-words text-slate-900 dark:text-white">{repository.homepage || "Not provided"}</dd></div>
              <div><dt className="text-sm text-slate-500">License</dt><dd className="text-slate-900 dark:text-white">{repository.license?.name || "No license listed"}</dd></div>
              <div><dt className="text-sm text-slate-500">Default branch</dt><dd className="text-slate-900 dark:text-white">{repository.defaultBranch}</dd></div>
              <div><dt className="text-sm text-slate-500">Main language</dt><dd className="text-slate-900 dark:text-white">{repository.language || "Unknown"}</dd></div>
              <div><dt className="text-sm text-slate-500">Created</dt><dd className="text-slate-900 dark:text-white">{formatDate(repository.createdAt)}</dd></div>
              <div><dt className="text-sm text-slate-500">Updated</dt><dd className="text-slate-900 dark:text-white">{formatDate(repository.updatedAt)}</dd></div>
            </dl>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Open Issues</h2>
            <div className="mt-4 space-y-3">
              {issues.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-300">No open issues returned by the current request.</p>}
              {issues.map((issue) => (
                <a key={issue.id} href={issue.htmlUrl} target="_blank" rel="noreferrer" className="block rounded-md border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                  <span className="font-medium text-slate-950 dark:text-white">#{issue.number} {issue.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{issue.comments} comments</span>
                </a>
              ))}
            </div>
          </section>
        </main>
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <Scale className="h-5 w-5 text-emerald-600" />
              Languages
            </h2>
            <div className="mt-4 space-y-3">
              {languages.map((item) => (
                <div key={item.language}>
                  <div className="mb-1 flex justify-between text-sm text-slate-700 dark:text-slate-200">
                    <span>{item.language}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <NoteBox fullName={repository.fullName} />
        </aside>
      </div>
    </div>
  );
}

