import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";
import ApplicationCard from "../components/ApplicationCard.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import Filters from "../components/Filters.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const defaultFilters = {
  search: "",
  company: "",
  status: "",
  from: "",
  to: ""
};

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState(["", "", ""]);

  const buildQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString() ? `?${params.toString()}` : "";
  };

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listApplications(buildQuery());
      setApplications(data.items);
      setMeta({ page: data.page, total: data.total, totalPages: data.totalPages });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    if (querySearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: querySearch }));
    }
  }, [searchParams]);

  useEffect(() => {
    loadApplications();
  }, [filters]);

  useEffect(() => {
    if (user?.dailyFocus?.length) {
      const next = [...user.dailyFocus];
      while (next.length < 3) next.push("");
      setTasks(next.slice(0, 3));
    }
  }, [user]);

  const summary = useMemo(() => {
    return applications.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );
  }, [applications]);

  const nextActions = useMemo(() => {
    const upcoming = [];
    applications.forEach((item) => {
      if (item.nextInterviewDate) {
        upcoming.push({
          type: "Interview",
          date: new Date(item.nextInterviewDate),
          label: `${item.role} @ ${item.company}`
        });
      }
      if (item.followUpDate) {
        upcoming.push({
          type: "Follow-up",
          date: new Date(item.followUpDate),
          label: `${item.role} @ ${item.company}`
        });
      }
    });
    return upcoming
      .filter((entry) => !Number.isNaN(entry.date.getTime()))
      .sort((a, b) => a.date - b.date)
      .slice(0, 4);
  }, [applications]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.deleteApplication(id);
      loadApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  const saveTasks = (next) => {
    setTasks(next);
  };

  const persistTasks = async () => {
    try {
      const updated = await api.updateMe({ dailyFocus: tasks });
      updateUser(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = (index, value) => {
    const next = [...tasks];
    next[index] = value;
    saveTasks(next);
  };

  const weeklyTrend = useMemo(() => {
    const now = new Date();
    const weeks = Array.from({ length: 6 }, (_, i) => ({
      label: `W-${5 - i}`,
      count: 0
    }));
    applications.forEach((app) => {
      const date = app.appliedDate ? new Date(app.appliedDate) : new Date(app.createdAt);
      const diffWeeks = Math.floor((now - date) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks >= 0 && diffWeeks < 6) {
        const index = 5 - diffWeeks;
        weeks[index].count += 1;
      }
    });
    const max = Math.max(1, ...weeks.map((w) => w.count));
    return { weeks, max };
  }, [applications]);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1 className="hero-title">Your job search command center.</h1>
          <p className="hero-sub">
            Track every opportunity, keep notes and contacts together, and stay ahead of
            follow-ups. JobTracker Pro keeps your pipeline organized and interview-ready.
          </p>
          <div className="hero-metrics">
            <div className="metric">
              Pipeline velocity
              <div className="muted">{applications.length} active roles</div>
            </div>
            <div className="metric">
              Focus today
              <div className="muted">{summary.Interview || 0} interviews</div>
            </div>
            <div className="metric">
              Offers in play
              <div className="muted">{summary.Offer || 0} offers</div>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <span className="badge">Today’s focus</span>
          <h3>Move one role forward</h3>
          <p className="muted">
            Log new applications, capture recruiter details, and schedule follow-ups in one place.
          </p>
          <ul className="list">
            <li>Update application status after each interaction</li>
            <li>Log interview prep notes and recruiter details</li>
            <li>Schedule follow-ups to stay top of mind</li>
          </ul>
        </div>
      </section>

      <div className="page-header">
        <div>
          <h2>Pipeline overview</h2>
          <p className="muted">A quick view of your progress across each hiring stage.</p>
        </div>
      </div>

      <section className="summary">
        <div className="summary-card">
          {summary.total}
          <span>Total applications</span>
        </div>
        <div className="summary-card">
          {summary.Applied || 0}
          <span>Applied</span>
        </div>
        <div className="summary-card">
          {summary.Interview || 0}
          <span>Interview</span>
        </div>
        <div className="summary-card">
          {summary.Offer || 0}
          <span>Offers</span>
        </div>
        <div className="summary-card">
          {summary.Rejected || 0}
          <span>Rejected</span>
        </div>
      </section>

      <section className="grid">
        <div className="card insight-card">
          <h3>Daily focus</h3>
          <p className="muted">Top 3 tasks to move your pipeline today.</p>
          <div className="focus-list">
            {tasks.map((task, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Task ${index + 1}`}
                value={task}
                onChange={(event) => updateTask(index, event.target.value)}
              />
            ))}
          </div>
          <button type="button" className="secondary" onClick={persistTasks}>
            Save focus
          </button>
        </div>
        <div className="card insight-card">
          <h3>Weekly trend</h3>
          <p className="muted">Applications created over the last 6 weeks.</p>
          <div className="trend-chart">
            {weeklyTrend.weeks.map((week) => (
              <div key={week.label} className="trend-bar">
                <div
                  className="trend-fill"
                  style={{ height: `${(week.count / weeklyTrend.max) * 100}%` }}
                />
                <span>{week.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="card">
        <h3>Kanban board</h3>
        <p className="muted">Drag and drop applications across stages.</p>
        <KanbanBoard applications={applications} onRefresh={loadApplications} />
      </div>
      <section className="grid">
        <div className="card insight-card">
          <h3>Next actions</h3>
          <p className="muted">Keep these dates on your radar.</p>
          {nextActions.length === 0 ? (
            <p className="muted">Add interview or follow-up dates to see reminders here.</p>
          ) : (
            <ul className="timeline">
              {nextActions.map((action, index) => (
                <li key={`${action.label}-${index}`}>
                  <div className="timeline-dot" />
                  <div>
                    <div className="timeline-title">
                      {action.type} — {action.label}
                    </div>
                    <div className="muted">{action.date.toDateString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card insight-card">
          <h3>Pipeline pulse</h3>
          <p className="muted">Stay balanced across stages.</p>
          <div className="pulse-grid">
            <div>
              <strong>{summary.Applied || 0}</strong>
              <span className="muted">Applied</span>
            </div>
            <div>
              <strong>{summary.Interview || 0}</strong>
              <span className="muted">Interview</span>
            </div>
            <div>
              <strong>{summary.Offer || 0}</strong>
              <span className="muted">Offer</span>
            </div>
            <div>
              <strong>{summary.Rejected || 0}</strong>
              <span className="muted">Rejected</span>
            </div>
          </div>
        </div>
      </section>

      <div className="highlight-grid">
        <div className="highlight">
          <h4>Pipeline health</h4>
          <p className="muted">
            Keep the top of your funnel strong while pushing key roles to final rounds.
          </p>
        </div>
        <div className="highlight">
          <h4>Reminder-ready</h4>
          <p className="muted">
            Schedule every follow-up date and interview so nothing slips through.
          </p>
        </div>
        <div className="highlight">
          <h4>Professional notes</h4>
          <p className="muted">
            Store recruiter context, interview prep, and debriefs where you can find them.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="page-header">
          <div>
            <h3>Create a new application</h3>
            <p className="muted">
              Add the latest role you are targeting and keep all details in one place.
            </p>
          </div>
          <Link to="/applications/new" className="primary">
            Add application
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>Filter your pipeline</h3>
        <p className="muted">Refine by stage, company, or application window.</p>
        <Filters filters={filters} onChange={setFilters} />
        <div className="filter-actions">
          <button type="button" onClick={loadApplications}>
            Apply filters
          </button>
          <button type="button" className="secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading applications...</p>}

      {!loading && applications.length === 0 && (
        <div className="card">
          <h3>No applications yet</h3>
          <p className="muted">
            Start by adding your first role from the button above in Today’s focus.
          </p>
        </div>
      )}

      <div className="page-header">
        <div>
          <h2>All applications</h2>
          <p className="muted">Keep everything searchable and easy to update.</p>
        </div>
      </div>

      <div className="grid">
        {applications.map((item) => (
          <ApplicationCard key={item._id} item={item} onDelete={handleDelete} />
        ))}
      </div>

      <p className="muted">
        Showing {applications.length} of {meta.total} applications.
      </p>
    </div>
  );
};

export default Dashboard;
