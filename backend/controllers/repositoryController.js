import {
  getRepository,
  getRepositoryIssues,
  getRepositoryLanguages,
  searchRepositories
} from "../services/githubService.js";

const SORT_MAP = {
  stars: "stars",
  forks: "forks",
  issues: "help-wanted-issues",
  updated: "updated"
};

function parsePagination(query) {
  const page = Math.max(Number.parseInt(query.page || "1", 10), 1);
  const per_page = Math.min(Math.max(Number.parseInt(query.per_page || "12", 10), 1), 30);
  return { page, per_page };
}

export async function search(req, res, next) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({ message: "Please enter a search term.", status: 400 });
    }

    const { page, per_page } = parsePagination(req.query);
    const sort = SORT_MAP[req.query.sort] || "stars";
    const results = await searchRepositories({
      q,
      page,
      per_page,
      sort,
      language: req.query.language,
      topic: req.query.topic
    });

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function details(req, res, next) {
  try {
    const repository = await getRepository(req.params.owner, req.params.repo);
    res.json(repository);
  } catch (error) {
    next(error);
  }
}

export async function languages(req, res, next) {
  try {
    const data = await getRepositoryLanguages(req.params.owner, req.params.repo);
    res.json({ languages: data });
  } catch (error) {
    next(error);
  }
}

export async function issues(req, res, next) {
  try {
    const { page, per_page } = parsePagination(req.query);
    const data = await getRepositoryIssues(req.params.owner, req.params.repo, { page, per_page });
    res.json({ issues: data, page, per_page });
  } catch (error) {
    next(error);
  }
}

