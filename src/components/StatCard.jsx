const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg = 'bg-blue-100',
  iconColor = 'text-blue-600',
  variant = 'default',
  className = '',
  children,
}) => {
  if (variant === 'simple') {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <p className="text-slate-500 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {Icon && (
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      )}
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {children}
    </div>
  );
};

export default StatCard;
