const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const DentistCard = ({ dentist, onBookAppointment }) => {
  const {
    name,
    qualification,
    yearsOfExperience,
    clinicName,
    address,
    location,
    photo,
    specialization,
    rating,
  } = dentist;

  const initials = name
    .split(" ")
    .slice(1, 3)
    .map((n) => n[0])
    .join("");

  return (
    <div className="bg-white rounded-2xl border border-teal-50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group animate-fade-in">
      {/* Top accent strip */}
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600" />

      <div className="p-5">
        {/* Header: photo + name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-teal-100"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-16 h-16 rounded-xl bg-teal-600 text-white font-heading text-lg font-bold items-center justify-center ${
                photo ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-bold text-gray-800 truncate">{name}</h3>
            <p className="text-xs text-teal-600 font-medium mt-0.5">{specialization}</p>
            <div className="mt-1">
              <StarRating rating={rating} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-teal-500">🎓</span>
            <span className="truncate">{qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-500">⏱️</span>
            <span>{yearsOfExperience} years of experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-500">🏥</span>
            <span className="font-medium text-gray-700 truncate">{clinicName}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">📍</span>
            <span className="line-clamp-2 leading-relaxed">{address}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBookAppointment(dentist)}
          className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm shadow-teal-200 group-hover:shadow-teal-300"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DentistCard;
