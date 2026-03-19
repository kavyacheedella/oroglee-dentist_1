import { useState, useEffect, useCallback } from "react";
import DentistCard from "../components/DentistCard";
import AppointmentModal from "../components/AppointmentModal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";
import { fetchDentists } from "../utils/api";

const LOCATIONS = ["All", "Hyderabad", "Bangalore", "Chennai", "Pune", "Mumbai", "Delhi"];

const HomePage = () => {
  const [dentists, setDentists] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadDentists = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDentists({
        search,
        location: locationFilter === "All" ? "" : locationFilter,
        page: currentPage,
        limit: 9,
      });
      setDentists(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || "Failed to load dentists. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, locationFilter, currentPage]);

  useEffect(() => {
    loadDentists();
  }, [loadDentists]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleLocationChange = (loc) => {
    setLocationFilter(loc === "All" ? "" : loc);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="text-teal-200">🦷</span>
            <span>Trusted dental care, one click away</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
            Find Your Perfect <br />
            <span className="text-teal-200">Dentist Today</span>
          </h1>
          <p className="text-teal-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Browse verified dental professionals, check availability, and book your appointment in minutes.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, specialization, or clinic..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LOCATIONS.map((loc) => {
            const active = loc === "All" ? !locationFilter : locationFilter === loc;
            return (
              <button
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {pagination.total > 0 ? (
                <>
                  Showing <span className="font-semibold text-gray-700">{dentists.length}</span> of{" "}
                  <span className="font-semibold text-gray-700">{pagination.total}</span> dentists
                  {search && <span className="text-teal-600"> for "{search}"</span>}
                </>
              ) : (
                "No dentists found"
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <p className="text-red-600 font-medium mb-3">⚠️ {error}</p>
            <button
              onClick={loadDentists}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton count={9} />}

        {/* Dentist Grid */}
        {!loading && !error && dentists.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dentists.map((dentist) => (
                <DentistCard
                  key={dentist._id}
                  dentist={dentist}
                  onBookAppointment={setSelectedDentist}
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && dentists.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🦷</div>
            <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">No dentists found</h3>
            <p className="text-gray-400 text-sm mb-6">
              Try adjusting your search or location filter.
            </p>
            <button
              onClick={() => { setSearchInput(""); setLocationFilter(""); }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDentist && (
        <AppointmentModal
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
