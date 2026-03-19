import { useState } from "react";
import { createAppointment } from "../utils/api";

const AppointmentModal = ({ dentist, onClose }) => {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    appointmentDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};
    if (!form.patientName.trim()) newErrors.patientName = "Patient name is required";
    else if (form.patientName.trim().length < 2) newErrors.patientName = "Name must be at least 2 characters";

    if (!form.age) newErrors.age = "Age is required";
    else if (form.age < 1 || form.age > 120) newErrors.age = "Please enter a valid age (1–120)";

    if (!form.gender) newErrors.gender = "Please select a gender";

    if (!form.appointmentDate) newErrors.appointmentDate = "Appointment date is required";
    else if (form.appointmentDate < today) newErrors.appointmentDate = "Date cannot be in the past";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createAppointment({ ...form, age: Number(form.age), dentistId: dentist._id });
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field]
        ? "border-red-300 focus:ring-red-200 bg-red-50"
        : "border-gray-200 focus:ring-teal-200 focus:border-teal-400 bg-white"
    }`;

  // Backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (success) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-2">All Set! 🎉</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-1">
            Your appointment with <span className="font-semibold text-teal-700">{dentist.name}</span> has been booked.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            📅 {new Date(form.appointmentDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Please arrive 10 minutes early at <span className="text-teal-600">{dentist.clinicName}</span>.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-teal-100 text-xs font-medium mb-1">Booking appointment with</p>
          <h2 className="font-heading text-xl font-bold text-white">{dentist.name}</h2>
          <p className="text-teal-200 text-sm mt-0.5">{dentist.clinicName} · {dentist.location}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              ⚠️ {errors.submit}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={inputClass("patientName")}
            />
            {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                min="1"
                max="120"
                className={inputClass("age")}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass("gender")}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Appointment Date *
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              min={today}
              className={inputClass("appointmentDate")}
            />
            {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any specific concerns or information..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 text-sm font-body focus:outline-none transition-all duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm shadow-teal-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Booking...
              </>
            ) : (
              "Confirm Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
