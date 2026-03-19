const STATUS_STYLES = {
  Booked: "bg-blue-50 text-blue-700 border border-blue-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_DOTS = {
  Booked: "bg-blue-500",
  Completed: "bg-green-500",
  Cancelled: "bg-red-400",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || "bg-gray-400"}`} />
    {status}
  </span>
);

export default StatusBadge;
