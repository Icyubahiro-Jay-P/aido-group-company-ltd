const PageBanner = ({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-blue-600 to-cyan-600',
  className = '',
  children,
}) => {
  return (
    <div className={`mb-8 bg-linear-to-r ${gradient} rounded-xl p-6 text-white shadow-lg ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="opacity-90">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="opacity-80">
            <Icon size={48} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageBanner;
