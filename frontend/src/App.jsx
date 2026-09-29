import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analytics from "./pages/Analytics";
import Bookmarks from "./pages/Bookmarks";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RepositoryDetails from "./pages/RepositoryDetails";
import SearchResults from "./pages/SearchResults";
import {
  clearLocalProfile,
  getLocalProfile,
  getThemePreference,
  saveLocalProfile,
  saveThemePreference
} from "./utils/storage";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => getThemePreference() === "dark");
  const [user, setUser] = useState(getLocalProfile);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    saveThemePreference(darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSignIn = (profile) => {
    saveLocalProfile(profile);
    setUser(profile);
  };

  const handleSignOut = () => {
    clearLocalProfile();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
        user={user}
        onSignOut={handleSignOut}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login user={user} onSignIn={handleSignIn} />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/repository/:owner/:repo" element={<RepositoryDetails />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
