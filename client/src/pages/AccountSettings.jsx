import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AccountSettings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    weeklyDigest: true,
    interviewReminders: true
  });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Settings saved locally (API hookup coming next). ");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Account settings</h2>
          <p className="muted">Keep your profile, preferences, and security up to date.</p>
        </div>
      </div>

      <div className="settings-grid">
        <form className="card form settings-card" onSubmit={handleSubmit}>
          <h3>Profile</h3>
          <p className="muted">Update your public name and contact email.</p>
          <div className="grid-two">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>

          <h3>Work preferences</h3>
          <p className="muted">Set defaults for new applications.</p>
          <div className="grid-two">
            <select>
              <option>Preferred work mode</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
            <input type="text" placeholder="Target salary range (e.g. $80k - $120k)" />
          </div>

          <h3>Notifications</h3>
          <p className="muted">Choose what you want to hear about.</p>
          <div className="notice-list">
            <label className="notice-card">
              <div>
                <div className="notice-title">Weekly progress digest</div>
                <div className="muted">A summary of applications, interviews, and wins.</div>
              </div>
              <input
                type="checkbox"
                checked={form.weeklyDigest}
                onChange={(event) => setForm({ ...form, weeklyDigest: event.target.checked })}
              />
            </label>
            <label className="notice-card">
              <div>
                <div className="notice-title">Interview & follow‑up reminders</div>
                <div className="muted">Nudges before interview dates and follow‑ups.</div>
              </div>
              <input
                type="checkbox"
                checked={form.interviewReminders}
                onChange={(event) => setForm({ ...form, interviewReminders: event.target.checked })}
              />
            </label>
            <label className="notice-card">
              <div>
                <div className="notice-title">Application reminders</div>
                <div className="muted">Alerts when you haven’t updated a role in 7 days.</div>
              </div>
              <input type="checkbox" defaultChecked />
            </label>
          </div>

          <h3>Privacy</h3>
          <p className="muted">Control visibility and exports.</p>
          <div className="notice-list">
            <label className="notice-card">
              <div>
                <div className="notice-title">Show public profile</div>
                <div className="muted">Make your profile visible to shared links.</div>
              </div>
              <input type="checkbox" />
            </label>
            <label className="notice-card">
              <div>
                <div className="notice-title">Export data monthly</div>
                <div className="muted">Email a CSV of your pipeline every month.</div>
              </div>
              <input type="checkbox" />
            </label>
          </div>

          {message && <p className="success">{message}</p>}
          <button type="submit">Save settings</button>
        </form>

        <div className="card settings-card">
          <h3>Security</h3>
          <p className="muted">Keep your account safe and up to date.</p>
          <div className="settings-actions">
            <Link to="/forgot-password" className="primary">
              Reset password
            </Link>
            <button type="button" className="secondary">
              Enable 2‑step verification
            </button>
          </div>
          <div className="settings-divider" />
          <h3>Connected tools</h3>
          <p className="muted">Sync your workflow with other services.</p>
          <div className="settings-actions">
            <button type="button" className="secondary">
              Connect Google Calendar
            </button>
            <button type="button" className="secondary">
              Connect Notion
            </button>
          </div>
          <div className="settings-divider" />
          <h3>Workspace</h3>
          <p className="muted">Personalize your job search workspace.</p>
          <ul className="list">
            <li>Default work mode: Remote</li>
            <li>Primary role: Full‑stack engineer</li>
            <li>Target salary: $80k – $120k</li>
          </ul>
          <div className="settings-divider" />
          <h3>Danger zone</h3>
          <p className="muted">These actions are permanent.</p>
          <button type="button" className="danger">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
