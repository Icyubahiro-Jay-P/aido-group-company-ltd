import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  icon: Icon = AlertTriangle,
  iconBg = 'bg-red-100',
  iconColor = 'text-red-600',
  danger = true,
  variant = 'centered',
  children,
}) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const confirmButtonClass = danger
    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm';

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow-2xl w-full overflow-hidden ${
          variant === 'compact' ? 'max-w-md p-6' : 'max-w-95 mx-4'
        }`}
      >
        {variant === 'centered' ? (
          <>
            <div className="px-8 pt-10 pb-6 text-center">
              <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon size={42} className={iconColor} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h3>
              {message && (
                <p className="text-slate-600 text-[15px] leading-relaxed px-2">{message}</p>
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3.5 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all rounded-md focus:outline-none cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all rounded-md focus:outline-none cursor-pointer ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                  <Icon size={24} className={iconColor} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {message && <p className="text-slate-600 mb-6">{message}</p>}
            {children}

            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                {cancelText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
