import React, { useMemo, useState } from "react";
import { api } from "../api/client.js";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const KanbanBoard = ({ applications, onRefresh }) => {
  const [draggingId, setDraggingId] = useState(null);
  const grouped = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status);
      return acc;
    }, {});
  }, [applications]);

  const handleDrop = async (status) => {
    if (!draggingId) return;
    try {
      await api.updateApplication(draggingId, { status });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDraggingId(null);
    }
  };

  return (
    <div className="kanban">
      {STATUSES.map((status) => (
        <div
          key={status}
          className="kanban-column"
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(status)}
        >
          <div className="kanban-header">
            <h4>{status}</h4>
            <span className="muted">{grouped[status]?.length || 0}</span>
          </div>
          <div className="kanban-list">
            {(grouped[status] || []).map((app) => (
              <div
                key={app._id}
                className="kanban-card"
                draggable
                onDragStart={() => setDraggingId(app._id)}
                onDragEnd={() => setDraggingId(null)}
              >
                <strong>{app.role}</strong>
                <span className="muted">{app.company}</span>
              </div>
            ))}
            {grouped[status]?.length === 0 && (
              <div className="kanban-empty">Drop items here</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
