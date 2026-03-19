const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// Dentist APIs
export const fetchDentists = async ({ search = "", location = "", page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);
  if (location) params.append("location", location);
  const res = await fetch(`${BASE_URL}/dentists?${params}`);
  return handleResponse(res);
};

export const fetchDentistById = async (id) => {
  const res = await fetch(`${BASE_URL}/dentists/${id}`);
  return handleResponse(res);
};

export const addDentist = async (dentistData) => {
  const res = await fetch(`${BASE_URL}/dentists`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(dentistData),
  });
  return handleResponse(res);
};

// Appointment APIs
export const createAppointment = async (appointmentData) => {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(res);
};

export const fetchAppointments = async ({ page = 1, limit = 10, status = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  const res = await fetch(`${BASE_URL}/appointments?${params}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(res);
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};

// Admin APIs
export const adminLogin = async (credentials) => {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
};
