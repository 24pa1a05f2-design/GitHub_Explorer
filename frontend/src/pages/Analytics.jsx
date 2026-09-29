import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import EmptyState from "../components/EmptyState";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function getAnalyticsRepos() {
  try {
    return JSON.parse(sessionStorage.getItem("github-explorer-analytics")) || [];
  } catch {
    return [];
  }
}

export default function Analytics() {
  const repositories = getAnalyticsRepos();

  const chartData = useMemo(() => {
    const labels = repositories.map((repo) => repo.name);
    const languageCounts = repositories.reduce((acc, repo) => {
      const language = repo.language || "Unknown";
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});

    return {
      starsForks: {
        labels,
        datasets: [
          { label: "Stars", data: repositories.map((repo) => repo.stars), backgroundColor: "#2da44e" },
          { label: "Forks", data: repositories.map((repo) => repo.forks), backgroundColor: "#0969da" }
        ]
      },
      issues: {
        labels,
        datasets: [{ label: "Open Issues", data: repositories.map((repo) => repo.openIssues), backgroundColor: "#bf8700" }]
      },
      languages: {
        labels: Object.keys(languageCounts),
        datasets: [
          {
            data: Object.values(languageCounts),
            backgroundColor: ["#2da44e", "#0969da", "#bf8700", "#cf222e", "#8250df", "#57606a", "#1f883d", "#0550ae"]
          }
        ]
      }
    };
  }, [repositories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#64748b" } }
    },
    scales: {
      x: { ticks: { color: "#64748b" }, grid: { color: "rgba(148, 163, 184, 0.18)" } },
      y: { ticks: { color: "#64748b" }, grid: { color: "rgba(148, 163, 184, 0.18)" } }
    }
  };

  if (repositories.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="No analytics data available." description="Run a repository search first so charts can use real GitHub data." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Analytics</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Charts are based only on repositories retrieved from GitHub in this session.</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-950 dark:text-white">Stars vs Forks</h2>
          <div className="mt-4 h-80">
            <Bar data={chartData.starsForks} options={options} />
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-950 dark:text-white">Open Issues</h2>
          <div className="mt-4 h-80">
            <Bar data={chartData.issues} options={options} />
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-950 dark:text-white">Language Distribution</h2>
          <div className="mt-4 h-80">
            <Doughnut data={chartData.languages} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-950 dark:text-white">Activity Data</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Historical activity data is not available from the current GitHub API data.
          </p>
        </section>
      </div>
    </div>
  );
}

