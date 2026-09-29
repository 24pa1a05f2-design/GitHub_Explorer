const GITHUB_API_BASE = "https://api.github.com";
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "open-source-github-project-explorer"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function normalizeError(status, data) {
  if (status === 403 && /rate limit/i.test(data?.message || "")) {
    const error = new Error("GitHub API rate limit reached. Please try again later or configure a GitHub token.");
    error.status = 429;
    error.publicMessage = error.message;
    return error;
  }

  if (status === 404) {
    const error = new Error("Repository not found.");
    error.status = 404;
    error.publicMessage = error.message;
    return error;
  }

  const error = new Error(data?.message || "GitHub API request failed.");
  error.status = status >= 400 && status < 600 ? status : 502;
  error.publicMessage = error.message;
  return error;
}

async function githubFetch(path, params = {}) {
  const url = new URL(`${GITHUB_API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let response;
  try {
    response = await fetch(url, { headers: buildHeaders() });
  } catch {
    const error = new Error("Unable to reach the GitHub API. Please check the server network connection and try again.");
    error.status = 503;
    error.publicMessage = error.message;
    throw error;
  }
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw normalizeError(response.status, data);
  }

  cache.set(cacheKey, { timestamp: Date.now(), data });
  return data;
}

function normalizeRepository(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: {
      login: repo.owner?.login,
      avatarUrl: repo.owner?.avatar_url,
      htmlUrl: repo.owner?.html_url
    },
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    watchers: repo.watchers_count,
    topics: repo.topics || [],
    license: repo.license ? { name: repo.license.name, key: repo.license.key } : null,
    defaultBranch: repo.default_branch,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at
  };
}

function buildSearchQuery({ q, language, topic }) {
  const parts = [q.trim()];
  if (language && language !== "All") {
    parts.push(`language:${language}`);
  }
  if (topic && topic !== "All") {
    parts.push(`topic:${topic.toLowerCase().replaceAll(" ", "-")}`);
  }
  return parts.join(" ");
}

export async function searchRepositories({ q, page = 1, per_page = 12, sort = "stars", language, topic }) {
  const data = await githubFetch("/search/repositories", {
    q: buildSearchQuery({ q, language, topic }),
    page,
    per_page,
    sort,
    order: "desc"
  });

  return {
    total_count: Math.min(data.total_count || 0, 1000),
    page: Number(page),
    per_page: Number(per_page),
    repositories: (data.items || []).map(normalizeRepository)
  };
}

export async function getRepository(owner, repo) {
  const data = await githubFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  return normalizeRepository(data);
}

export async function getRepositoryLanguages(owner, repo) {
  const languages = await githubFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);

  return Object.entries(languages).map(([language, bytes]) => ({
    language,
    bytes,
    percentage: total ? Number(((bytes / total) * 100).toFixed(2)) : 0
  }));
}

export async function getRepositoryIssues(owner, repo, { page = 1, per_page = 10 } = {}) {
  const issues = await githubFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`, {
    state: "open",
    page,
    per_page
  });

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      htmlUrl: issue.html_url,
      state: issue.state,
      createdAt: issue.created_at,
      comments: issue.comments,
      user: {
        login: issue.user?.login,
        avatarUrl: issue.user?.avatar_url
      }
    }));
}

