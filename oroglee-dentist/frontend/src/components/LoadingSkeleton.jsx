const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-teal-50 shadow-sm overflow-hidden">
    <div className="h-1 bg-gray-100" />
    <div className="p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton rounded-lg w-3/4" />
          <div className="h-3 skeleton rounded-lg w-1/2" />
          <div className="h-3 skeleton rounded-lg w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 skeleton rounded-lg" style={{ width: `${70 + i * 5}%` }} />
        ))}
      </div>
      <div className="h-10 skeleton rounded-xl" />
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
