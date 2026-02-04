import React from "react";

const Filters = ({ filters, onChange }) => {
  return (
    <div className="filters">
      <div className="field">
        <div className="field-label">Search</div>
        <div className="field-help">Company or role</div>
        <input
          type="text"
          placeholder="Type a keyword..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">Company</div>
        <div className="field-help">e.g. OpenAI, Google, Stripe</div>
        <input
          type="text"
          placeholder="Company name"
          value={filters.company}
          onChange={(event) => onChange({ ...filters, company: event.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">Status</div>
        <div className="field-help">Pick a stage</div>
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="field">
        <div className="field-label">From</div>
        <div className="field-help">Start date</div>
        <input
          type="date"
          value={filters.from}
          onChange={(event) => onChange({ ...filters, from: event.target.value })}
        />
      </div>
      <div className="field">
        <div className="field-label">To</div>
        <div className="field-help">End date</div>
        <input
          type="date"
          value={filters.to}
          onChange={(event) => onChange({ ...filters, to: event.target.value })}
        />
      </div>
    </div>
  );
};

export default Filters;
