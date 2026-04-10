import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDestructive = true, loading = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-center items-center bg-black/60 backdrop-blur-sm px-4">
      <div className="absolute inset-0" onClick={!loading ? onClose : null} />
      
      <div className="bg-(--color-page-bg) w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in text-center p-6 border border-(--color-divider)">
        
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-50 text-(--color-danger)' : 'bg-(--color-primary-50) text-(--color-primary-500)'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <h3 className="font-heading font-bold text-xl text-(--color-text-heading) mb-2">
          {title}
        </h3>
        
        <p className="text-(--text-sm) text-(--color-text-body) mb-8">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full font-medium text-(--color-text-body) hover:bg-(--color-divider)/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-full font-medium text-white shadow-sm transition-all disabled:opacity-50
              ${isDestructive 
                ? 'bg-(--color-danger) hover:bg-red-700' 
                : 'bg-(--color-primary-500) hover:bg-(--color-primary-700)'
              }
            `}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
