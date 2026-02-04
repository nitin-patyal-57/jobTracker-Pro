import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";

const Profile = () => {
  const { user } = useAuth();
  const [headline, setHeadline] = useState("Open to full‑stack roles");
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [draftHeadline, setDraftHeadline] = useState(headline);

  useEffect(() => {
    const saved = localStorage.getItem("profileHeadline");
    if (saved) {
      setHeadline(saved);
      setDraftHeadline(saved);
    }
  }, []);

  const saveHeadline = () => {
    const next = draftHeadline.trim() || "Open to full‑stack roles";
    setHeadline(next);
    localStorage.setItem("profileHeadline", next);
    setEditingHeadline(false);
  };

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeStatus, setResumeStatus] = useState("");

  useEffect(() => {
    if (user?.resumeUrl) {
      setResumeUrl(user.resumeUrl);
    }
  }, [user]);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setResumeStatus("Uploading...");
    try {
      const data = await api.uploadResume(resumeFile);
      setResumeUrl(data.resumeUrl);
      setResumeStatus("Resume uploaded");
      setResumeFile(null);
    } catch (err) {
      setResumeStatus(err.message || "Upload failed");
    }
  };

  return (
    <div className="page">
      <section className="profile-hero">
        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.slice(0, 2)?.toUpperCase() || "JT"}</div>
          <div>
            <h2>{user?.name || "Your profile"}</h2>
            <p className="muted">{user?.email}</p>
            <p>{headline}</p>
            <div className="profile-tags">
              <span className="badge">Active search</span>
              <span className="badge">Full-stack</span>
              <span className="badge">Open to remote</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button
            type="button"
            className="primary"
            onClick={() => setEditingHeadline((prev) => !prev)}
          >
            {editingHeadline ? "Cancel" : "Update headline"}
          </button>
          <Link to="/forgot-password" className="secondary">
            Reset password
          </Link>
        </div>
      </section>

      {editingHeadline && (
        <div className="card">
          <h3>Edit headline</h3>
          <p className="muted">This appears under your name on the profile card.</p>
          <input
            type="text"
            value={draftHeadline}
            onChange={(event) => setDraftHeadline(event.target.value)}
          />
          <button type="button" onClick={saveHeadline}>
            Save headline
          </button>
        </div>
      )}

      <div className="profile-grid">
        <div className="card profile-card-animated">
          <h3>Weekly momentum</h3>
          <p className="muted">Keep your pipeline moving with a simple cadence.</p>
          <div className="summary">
            <div className="summary-card">
              5<span>Applications</span>
            </div>
            <div className="summary-card">
              2<span>Follow-ups</span>
            </div>
            <div className="summary-card">
              1<span>Mock interview</span>
            </div>
          </div>
        </div>

        <div className="card profile-card-animated">
          <h3>Focus areas</h3>
          <ul className="list">
            <li>Refine resume bullets for impact</li>
            <li>Schedule 2 recruiter touchpoints</li>
            <li>Prep one system design topic</li>
          </ul>
        </div>

        <div className="card profile-card-animated">
          <h3>Interview toolbox</h3>
          <p className="muted">Save your best prep resources in one place.</p>
          <ul className="list">
            <li>Behavioral stories (STAR format)</li>
            <li>Top 5 projects to highlight</li>
            <li>Company research checklist</li>
          </ul>
        </div>
      </div>

      <div className="card profile-card-animated">
        <h3>Resume</h3>
        <p className="muted">Upload your latest resume so it’s ready for new applications.</p>
        <div className="grid-two">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
          />
          <button type="button" className="secondary" onClick={handleResumeUpload}>
            Upload resume
          </button>
        </div>
        {resumeUrl && (
          <p className="muted">
            Current resume: <a href={resumeUrl}>View</a>
          </p>
        )}
        {resumeStatus && <p className="muted">{resumeStatus}</p>}
        <p className="muted">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
      </div>

      <div className="card profile-card-animated">
        <h3>Security</h3>
        <p className="muted">Reset your password when you need to secure your account.</p>
        <Link to="/forgot-password" className="primary">
          Start password reset
        </Link>
      </div>
    </div>
  );
};

export default Profile;
