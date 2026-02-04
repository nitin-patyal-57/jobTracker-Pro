import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-badge">JT</span>
        JobTracker Pro
      </div>
      <nav>
        {user ? (
          <>
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search company or role"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            <Link to="/">Dashboard</Link>
            <Link to="/applications/new">New</Link>
            <Link to="/profile">Profile</Link>
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button type="button" className="icon-button" aria-label="Notifications">
              🔔
            </button>
            <button type="button" className="avatar-button" onClick={() => setOpen((prev) => !prev)}>
              {user?.name?.slice(0, 2)?.toUpperCase() || "JT"}
            </button>
            {open && (
              <div className="menu">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  View profile
                </Link>
                <Link to="/applications/new" onClick={() => setOpen(false)}>
                  New application
                </Link>
                <Link to="/" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)}>
                  Account settings
                </Link>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
