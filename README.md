# Open Source GitHub Project Explorer

## About

Open Source GitHub Project Explorer is a full-stack developer tool for discovering, analyzing, and bookmarking GitHub repositories. The application keeps GitHub communication on the backend so secrets, rate-limit handling, and response normalization stay centralized.

## Features

- GitHub repository search with pagination
- Local profile sign-in with an email and username
- Express backend proxy for GitHub REST API
- Repository cards and details pages
- Language, topic, and trending time-window filters
- Sorting by stars, forks, issues, and recent updates
- Chart.js analytics from retrieved repository data
- Bookmarks and personal notes stored in localStorage
- Dark mode with persisted preference
- Loading, error, and empty states
- Responsive desktop, tablet, and mobile layout

## Architecture

```text
React Frontend
      ↓
Express Backend
      ↓
GitHub REST API
```

The React app calls only `/api/...` backend routes. It does not call `https://api.github.com` directly.

## Frontend

The frontend is built with React, Vite, Tailwind CSS, React Router, Lucide React, Chart.js, and react-chartjs-2.

## Backend

The backend is built with Node.js and Express. It separates routes, controllers, services, and middleware:

```text
repositoryRoutes.js
        ↓
repositoryController.js
        ↓
githubService.js
        ↓
GitHub REST API
```

## GitHub API Integration

GitHub API requests live in `backend/services/githubService.js`. The service normalizes repository, language, and issue responses before returning them to the frontend.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Node.js
- Express.js
- GitHub REST API
- Chart.js
- react-chartjs-2
- localStorage
- Lucide React

## Project Structure

```text
github-project-explorer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
GITHUB_TOKEN=
PORT=5000
```

`GITHUB_TOKEN` is optional. Without a token, the app uses unauthenticated GitHub API access and may hit lower rate limits.

## Sign-In

Enter an email address and username on the sign-in page. The profile is stored in the current browser only; there is no password, email verification, or shared account database. No OAuth credentials are needed.

## Running The App

Use Node.js 22.15 or newer so the backend can trust certificates installed in the operating system.

```bash
cd frontend
npm run dev
```

This starts both the Express API on port 5000 and the Vite frontend on port 5173. The Vite dev server proxies `/api` requests to the backend.

To run the services in separate terminals, start the backend with `npm run dev` from `backend`, then start the frontend with `npm run dev:frontend` from `frontend`.

## How The API Works

Repository endpoints:

```text
GET /api/repositories/search
GET /api/repositories/:owner/:repo
GET /api/repositories/:owner/:repo/languages
GET /api/repositories/:owner/:repo/issues
```

Example:

```text
GET /api/repositories/search?q=react&page=1&per_page=12
```

## Screenshots

Run the application locally and open the Vite URL to capture screenshots of the dashboard, search results, details, bookmarks, analytics, and dark mode.

## Future Improvements

- Verified accounts with server-side persistence
- Database persistence
- Advanced caching
- More analytics
- User profiles
- Repository comparison

## Author

Built as an Open Source GitHub Project Explorer full-stack project.
