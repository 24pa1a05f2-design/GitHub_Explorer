import { BarChart3, Bookmark, Github, LogOut, Moon, Search, Sun, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

export default function Navbar({ darkMode, onToggleTheme, user, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="inline-flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
          <Github className="h-6 w-6" aria-hidden="true" />
          GitHub Project Explorer
        </NavLink>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/search" className={linkClass}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </NavLink>
          <NavLink to="/bookmarks" className={linkClass}>
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            Bookmarks
          </NavLink>
          <NavLink to="/analytics" className={linkClass}>
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Analytics
          </NavLink>
          {user ? (
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 dark:border-slate-700">
              {user.avatarUrl && <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full" />}
              <span className="max-w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.username}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={linkClass}>
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Sign in
            </NavLink>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
