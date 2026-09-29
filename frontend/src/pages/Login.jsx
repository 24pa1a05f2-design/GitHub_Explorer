import { useState } from "react";
import { ArrowLeft, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login({ user, onSignIn }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="h-7 w-7 text-slate-900 dark:text-white" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Sign in</h1>
        </div>

        {user ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Signed in as <span className="font-semibold">{user.username}</span> ({user.email}).
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Explore
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Enter your email and choose a username to create your local profile.
            </p>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                onSignIn({ email: email.trim().toLowerCase(), username: username.trim() });
              }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Username
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  minLength={2}
                  maxLength={32}
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Continue
              </button>
            </form>
            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              This profile is saved only in this browser. Your email is not verified.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
