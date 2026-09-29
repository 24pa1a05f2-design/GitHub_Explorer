const BOOKMARKS_KEY = "github-explorer-bookmarks";
const NOTES_KEY = "github-explorer-notes";
const THEME_KEY = "github-explorer-theme";
const PROFILE_KEY = "github-explorer-profile";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getBookmarks() {
  return readJson(BOOKMARKS_KEY, []);
}

export function addBookmark(repo) {
  const bookmarks = getBookmarks();
  if (!bookmarks.some((item) => item.fullName === repo.fullName)) {
    writeJson(BOOKMARKS_KEY, [repo, ...bookmarks]);
  }
}

export function removeBookmark(fullName) {
  writeJson(
    BOOKMARKS_KEY,
    getBookmarks().filter((item) => item.fullName !== fullName)
  );
}

export function isBookmarked(fullName) {
  return getBookmarks().some((item) => item.fullName === fullName);
}

export function getNote(fullName) {
  return readJson(NOTES_KEY, {})[fullName] || "";
}

export function saveNote(fullName, note) {
  const notes = readJson(NOTES_KEY, {});
  notes[fullName] = note;
  writeJson(NOTES_KEY, notes);
}

export function deleteNote(fullName) {
  const notes = readJson(NOTES_KEY, {});
  delete notes[fullName];
  writeJson(NOTES_KEY, notes);
}

export function getThemePreference() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getLocalProfile() {
  return readJson(PROFILE_KEY, null);
}

export function saveLocalProfile(profile) {
  writeJson(PROFILE_KEY, profile);
}

export function clearLocalProfile() {
  localStorage.removeItem(PROFILE_KEY);
}
