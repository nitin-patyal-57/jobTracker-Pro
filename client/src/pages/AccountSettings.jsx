import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    workModeDefault: user?.preferences?.workModeDefault || "",
    targetSalary: user?.preferences?.targetSalary || "",
    weeklyDigest: user?.preferences?.notifications?.weeklyDigest ?? true,
    interviewReminders: user?.preferences?.notifications?.interviewReminders ?? true,
    applicationReminders: user?.preferences?.notifications?.applicationReminders ?? true,
    publicProfile: user?.preferences?.privacy?.publicProfile ?? false,
    monthlyExport: user?.preferences?.privacy?.monthlyExport ?? false
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updateMe({
        name: form.name,
        email: form.email,
        preferences: {
          workModeDefault: form.workModeDefault,
          targetSalary: form.targetSalary,
          notifications: {
            weeklyDigest: form.weeklyDigest,
            interviewReminders: form.interviewReminders,
            applicationReminders: form.applicationReminders
          },
          privacy: {
            publicProfile: form.publicProfile,
            monthlyExport: form.monthlyExport
          }
        }
      });
      updateUser(updated);
      setMessage("Settings saved.");
    } catch (err) {
      setMessage(err.message || "Failed to save settings.");
    }
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
            <select
              value={form.workModeDefault}
              onChange={(event) => setForm({ ...form, workModeDefault: event.target.value })}
            >
              <option value="">Preferred work mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
            <input
              type="text"
              placeholder="Target salary range (e.g. $80k - $120k)"
              value={form.targetSalary}
              onChange={(event) => setForm({ ...form, targetSalary: event.target.value })}
            />
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
              <input
                type="checkbox"
                checked={form.applicationReminders}
                onChange={(event) => setForm({ ...form, applicationReminders: event.target.checked })}
              />
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
              <input
                type="checkbox"
                checked={form.publicProfile}
                onChange={(event) => setForm({ ...form, publicProfile: event.target.checked })}
              />
            </label>
            <label className="notice-card">
              <div>
                <div className="notice-title">Export data monthly</div>
                <div className="muted">Email a CSV of your pipeline every month.</div>
              </div>
              <input
                type="checkbox"
                checked={form.monthlyExport}
                onChange={(event) => setForm({ ...form, monthlyExport: event.target.checked })}
              />
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
