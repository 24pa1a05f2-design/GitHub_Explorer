import RepoCard from "./RepoCard";

export default function RepoGrid({ repositories, onBookmarkChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {repositories.map((repo) => (
        <RepoCard key={repo.id || repo.fullName} repo={repo} onBookmarkChange={onBookmarkChange} />
      ))}
    </div>
  );
}

