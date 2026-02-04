const API_BASE = "/api";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const headers = {
    ...(options.headers || {})
  };
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  listApplications: (query = "") => request(`/apps${query}`),
  getApplication: (id) => request(`/apps/${id}`),
  createApplication: (payload) => request("/apps", { method: "POST", body: JSON.stringify(payload) }),
  updateApplication: (id, payload) =>
    request(`/apps/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteApplication: (id) => request(`/apps/${id}`, { method: "DELETE" }),
  uploadResume: (file) => {
    const data = new FormData();
    data.append("resume", file);
    return request("/uploads/resume", { method: "POST", body: data });
  }
};
