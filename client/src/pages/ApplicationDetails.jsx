import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getApplication(id);
        setApplication(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id]);

  if (error) return <div className="page error">{error}</div>;
  if (!application) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="badge">{application.status}</span>
          <h2>{application.role}</h2>
          <p className="muted">{application.company}</p>
        </div>
        <Link to={`/applications/${application._id}/edit`} className="primary">
          Edit application
        </Link>
      </div>

      <div className="card">
        <h3>Overview</h3>
        <div className="grid-two">
          <p>Location: {application.location || "-"}</p>
          <p>Work mode: {application.workMode || "-"}</p>
          <p>Priority: {application.priority || "-"}</p>
          <p>Source: {application.source || "-"}</p>
          <p>Applied: {application.appliedDate ? new Date(application.appliedDate).toDateString() : "-"}</p>
          <p>
            Next interview: {application.nextInterviewDate ? new Date(application.nextInterviewDate).toDateString() : "-"}
          </p>
          <p>Follow-up: {application.followUpDate ? new Date(application.followUpDate).toDateString() : "-"}</p>
        </div>
        <p>Salary range: {application.salaryRange || "-"}</p>
        <p className="muted">Created: {new Date(application.createdAt).toDateString()}</p>
        <p className="muted">Last updated: {new Date(application.updatedAt).toDateString()}</p>
      </div>

      <div className="card">
        <h3>Notes</h3>
        <p>{application.notes || "No notes"}</p>
      </div>

      <div className="card">
        <h3>Contacts</h3>
        {application.contacts && application.contacts.length > 0 ? (
          <ul className="list">
            {application.contacts.map((contact, index) => (
              <li key={index}>
                {contact.name || "(No name)"} — {contact.role || "Role"} — {contact.email || "No email"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts added yet.</p>
        )}
      </div>

      <div className="card">
        <h3>Links</h3>
        {application.links && application.links.length > 0 ? (
          <ul className="list">
            {application.links.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No links added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
