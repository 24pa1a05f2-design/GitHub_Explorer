async function request(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new Error("Unable to reach the API server. Run npm run dev from the frontend folder.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fallback = response.status >= 500
      ? "The API server is unavailable. Run npm run dev from the frontend folder."
      : "Request failed. Please try again.";
    throw new Error(data.message || fallback);
  }

  return data;
}

export function searchRepositories({ q, page = 1, perPage = 12, sort = "stars", language = "All", topic = "All" }) {
  const params = new URLSearchParams({
    q,
    page,
    per_page: perPage,
    sort,
    language,
    topic
  });
  return request(`/api/repositories/search?${params}`);
}

export function getRepository(owner, repo) {
  return request(`/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}

export function getRepositoryLanguages(owner, repo) {
  return request(`/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);
}

export function getRepositoryIssues(owner, repo) {
  return request(`/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`);
}
