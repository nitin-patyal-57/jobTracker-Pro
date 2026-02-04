import React from "react";
import { Link } from "react-router-dom";

const ApplicationCard = ({ item, onDelete }) => {
  return (
    <div className="card">
      <div className="page-header">
        <div>
          <span className="badge">{item.status}</span>
          <h3>{item.role}</h3>
          <p className="muted">{item.company}</p>
        </div>
        <span className="muted">{new Date(item.updatedAt).toLocaleDateString()}</span>
      </div>
      <div className="grid-two">
        <p className="muted">Location: {item.location || "-"}</p>
        <p className="muted">Applied: {item.appliedDate ? new Date(item.appliedDate).toDateString() : "-"}</p>
      </div>
      <div className="card-actions">
        <Link to={`/applications/${item._id}`}>View</Link>
        <Link to={`/applications/${item._id}/edit`}>Edit</Link>
        <button type="button" onClick={() => onDelete(item._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
