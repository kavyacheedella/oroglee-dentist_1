import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchAppointments, updateAppointmentStatus, addDentist } from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";

const STATS_COLORS = {
  total: "bg-blue-50 text-blue-700 border-blue-100",
  Booked: "bg-teal-50 text-teal-700 border-teal-100",
  Completed: "bg-green-50 text-green-700 border-green-100",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
};

const AdminPage = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [showAddDentist, setShowAddDentist] = useState(false);

  // Stats
  const stats = {
    total: pagination.total,
    Booked: appointments.filter((a) => a.status === "Booked").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAppointments({ page: currentPage, limit: 10, status: statusFilter });
      setAppointments(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (!isAdmin) { navigate("/admin/login"); return; }
    loadAppointments();
  }, [isAdmin, navigate, loadAppointments]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const data = await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: data.data.status } : a))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-400 mt-0.5">OroGlee Dental Platform</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Appointments", key: "total", icon: "📋" },
            { label: "Booked", key: "Booked", icon: "📅" },
            { label: "Completed", key: "Completed", icon: "✅" },
            { label: "Cancelled", key: "Cancelled", icon: "❌" },
          ].map(({ label, key, icon }) => (
            <div key={key} className={`bg-white rounded-2xl border p-4 ${STATS_COLORS[key]}`}>
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-2xl font-bold font-heading">{stats[key]}</p>
              <p className="text-xs font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => setShowAddDentist(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Dentist
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["", "Booked", "Completed", "Cancelled"].map((status) => (
            <button
              key={status || "all"}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              {status || "All Status"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            ⚠️ {error}
            <button onClick={loadAppointments} className="ml-3 underline text-xs">Retry</button>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <svg className="w-6 h-6 animate-spin mr-3 text-teal-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">
                {statusFilter ? `No ${statusFilter} appointments yet.` : "No appointments have been booked yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["Patient Name", "Age", "Gender", "Appointment Date", "Dentist", "Clinic", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-800">{apt.patientName}</td>
                        <td className="px-5 py-4 text-gray-600">{apt.age}</td>
                        <td className="px-5 py-4 text-gray-600">{apt.gender}</td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(apt.appointmentDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-medium">
                          {apt.dentist?.name || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {apt.dentist?.clinicName || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={apt.status} />
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                            disabled={updatingId === apt._id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-50 bg-white"
                          >
                            <option value="Booked">Booked</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <div key={apt._id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{apt.patientName}</p>
                        <p className="text-xs text-gray-500">{apt.age} yrs · {apt.gender}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>📅 {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p>👨‍⚕️ {apt.dentist?.name || "—"} — {apt.dentist?.clinicName || "—"}</p>
                    </div>
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                      disabled={updatingId === apt._id}
                      className="mt-3 text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none w-full bg-white disabled:opacity-50"
                    >
                      <option value="Booked">Booked</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Dentist Modal */}
      {showAddDentist && (
        <AddDentistModal onClose={() => setShowAddDentist(false)} />
      )}
    </div>
  );
};

// Add Dentist Modal
const AddDentistModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "", qualification: "", yearsOfExperience: "",
    clinicName: "", address: "", location: "",
    specialization: "", photo: "", rating: "4.5",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addDentist({ ...form, yearsOfExperience: Number(form.yearsOfExperience), rating: Number(form.rating) });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">Dentist Added!</h3>
          <p className="text-gray-400 text-sm mb-6">The new dentist profile is now live.</p>
          <button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  const fieldClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 rounded-t-3xl">
          <h2 className="font-heading text-xl font-bold text-white">Add New Dentist</h2>
          <p className="text-teal-200 text-sm mt-0.5">Fill in the dentist profile details</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Full Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Dr. Full Name" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Qualification *</label>
              <input name="qualification" required value={form.qualification} onChange={handleChange} placeholder="BDS, MDS" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Experience (yrs) *</label>
              <input type="number" name="yearsOfExperience" required min="0" value={form.yearsOfExperience} onChange={handleChange} placeholder="10" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Specialization</label>
              <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Orthodontics" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} className={fieldClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Clinic Name *</label>
              <input name="clinicName" required value={form.clinicName} onChange={handleChange} placeholder="Clinic Name" className={fieldClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Address *</label>
              <input name="address" required value={form.address} onChange={handleChange} placeholder="Full clinic address" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>City/Location *</label>
              <input name="location" required value={form.location} onChange={handleChange} placeholder="Hyderabad" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Photo URL</label>
              <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className={fieldClass} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg> Adding...</>
              ) : "Add Dentist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
