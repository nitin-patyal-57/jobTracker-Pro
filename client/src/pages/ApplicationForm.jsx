import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client.js";

const emptyApplication = {
  company: "",
  role: "",
  status: "Applied",
  priority: "Medium",
  workMode: "Remote",
  source: "",
  salaryRange: "",
  location: "",
  appliedDate: "",
  nextInterviewDate: "",
  followUpDate: "",
  notes: "",
  contacts: [],
  links: []
};

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyApplication);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;

    const fetchApplication = async () => {
      setLoading(true);
      try {
        const data = await api.getApplication(id);
        setForm({
          company: data.company || "",
          role: data.role || "",
          status: data.status || "Applied",
          priority: data.priority || "Medium",
          workMode: data.workMode || "Remote",
          source: data.source || "",
          salaryRange: data.salaryRange || "",
          location: data.location || "",
          appliedDate: data.appliedDate ? data.appliedDate.slice(0, 10) : "",
          nextInterviewDate: data.nextInterviewDate ? data.nextInterviewDate.slice(0, 10) : "",
          followUpDate: data.followUpDate ? data.followUpDate.slice(0, 10) : "",
          notes: data.notes || "",
          contacts: data.contacts || [],
          links: data.links || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await api.updateApplication(id, form);
      } else {
        await api.createApplication(form);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = (index, field, value) => {
    const next = [...form.contacts];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, contacts: next });
  };

  const addContact = () => {
    setForm({
      ...form,
      contacts: [...form.contacts, { name: "", email: "", role: "", phone: "" }]
    });
  };

  const removeContact = (index) => {
    setForm({
      ...form,
      contacts: form.contacts.filter((_, i) => i !== index)
    });
  };

  const updateLink = (index, field, value) => {
    const next = [...form.links];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, links: next });
  };

  const addLink = () => {
    setForm({
      ...form,
      links: [...form.links, { label: "", url: "" }]
    });
  };

  const removeLink = (index) => {
    setForm({
      ...form,
      links: form.links.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{isEdit ? "Edit application" : "New application"}</h2>
          <p className="muted">
            Capture every detail so you are ready for the next interview stage.
          </p>
        </div>
      </div>

      <form className="card form neon-card" onSubmit={handleSubmit}>
        <div className="form-panel">
          <h3>Role details</h3>
          <div className="grid-two">
            <input
              type="text"
              placeholder="Company"
              value={form.company}
              onChange={(event) => setForm({ ...form, company: event.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              required
            />
          </div>
          <div className="grid-two">
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
            />
            <input
              type="text"
              placeholder="Source (LinkedIn, Referral)"
              value={form.source}
              onChange={(event) => setForm({ ...form, source: event.target.value })}
            />
          </div>
        </div>

        <div className="form-panel">
          <h3>Stage & priority</h3>
          <div className="pill-group">
            {["Applied", "Interview", "Offer", "Rejected"].map((value) => (
              <label key={value} className={`pill ${form.status === value ? "active" : ""}`}>
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={form.status === value}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                />
                {value}
              </label>
            ))}
          </div>
          <div className="pill-group">
            {["Low", "Medium", "High"].map((value) => (
              <label key={value} className={`pill ${form.priority === value ? "active" : ""}`}>
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={form.priority === value}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                />
                {value} priority
              </label>
            ))}
          </div>
          <div className="pill-group">
            {["Remote", "Hybrid", "Onsite"].map((value) => (
              <label key={value} className={`pill ${form.workMode === value ? "active" : ""}`}>
                <input
                  type="radio"
                  name="workMode"
                  value={value}
                  checked={form.workMode === value}
                  onChange={(event) => setForm({ ...form, workMode: event.target.value })}
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="form-panel">
          <h3>Timeline</h3>
          <div className="grid-two">
            <label>
              Applied date
              <input
                type="date"
                value={form.appliedDate}
                onChange={(event) => setForm({ ...form, appliedDate: event.target.value })}
              />
            </label>
            <label>
              Next interview
              <input
                type="date"
                value={form.nextInterviewDate}
                onChange={(event) => setForm({ ...form, nextInterviewDate: event.target.value })}
              />
            </label>
          </div>
          <label>
            Follow-up date
            <input
              type="date"
              value={form.followUpDate}
              onChange={(event) => setForm({ ...form, followUpDate: event.target.value })}
            />
          </label>
        </div>

        <div className="form-panel">
          <h3>Compensation</h3>
          <input
            type="text"
            placeholder="Salary range (e.g. $80k - $110k)"
            value={form.salaryRange}
            onChange={(event) => setForm({ ...form, salaryRange: event.target.value })}
          />
        </div>

        <div className="form-panel">
          <h3>Notes</h3>
          <textarea
            rows="4"
            placeholder="Interview prep, recruiter call notes, and next steps."
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
        </div>

        <div className="subsection">
          <div className="subsection-header">
            <h4>Contacts</h4>
            <button type="button" className="secondary" onClick={addContact}>
              Add contact
            </button>
          </div>
          {form.contacts.map((contact, index) => (
            <div key={index} className="grid-two">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(event) => updateContact(index, "name", event.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(event) => updateContact(index, "email", event.target.value)}
              />
              <input
                type="text"
                placeholder="Role"
                value={contact.role}
                onChange={(event) => updateContact(index, "role", event.target.value)}
              />
              <input
                type="text"
                placeholder="Phone"
                value={contact.phone}
                onChange={(event) => updateContact(index, "phone", event.target.value)}
              />
              <button type="button" className="danger" onClick={() => removeContact(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="subsection">
          <div className="subsection-header">
            <h4>Links</h4>
            <button type="button" className="secondary" onClick={addLink}>
              Add link
            </button>
          </div>
          {form.links.map((link, index) => (
            <div key={index} className="grid-two">
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(event) => updateLink(index, "label", event.target.value)}
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(event) => updateLink(index, "url", event.target.value)}
              />
              <button type="button" className="danger" onClick={() => removeLink(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
