import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    token: searchParams.get("token") || "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (form.newPassword !== form.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const data = await api.resetPassword({
        token: form.token,
        newPassword: form.newPassword
      });
      setMessage(data.message || "Password updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="card">
        <span className="badge">Password reset</span>
        <h2>Set a new password</h2>
        <p className="muted">Use the reset token to update your password.</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Reset token"
            value={form.token}
            onChange={(event) => setForm({ ...form, token: event.target.value })}
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
            minLength={6}
          />
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
        <p className="muted">
          Ready to sign in? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
