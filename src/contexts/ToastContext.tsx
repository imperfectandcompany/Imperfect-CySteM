import { createContext, FunctionalComponent, VNode } from 'preact';
import { useCallback, useContext, useState } from 'preact/hooks';

interface Toast {
  id: number;
  message: string;
  duration: number;
  icon: string;
}

interface ToastContextProps {
  toasts: Toast[];
  addToast: (message: string, icon?: string, duration?: number) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastId = 0;

const defaultIcons: { [key: string]: string } = {
  success: 'fa fa-check-circle',
  error: 'fa fa-times-circle',
  warning: 'fa fa-exclamation-triangle',
  info: 'fa fa-info-circle',
};

export const ToastProvider: FunctionalComponent<{ children: VNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, icon: string = 'info', duration: number = 5000) => {
    const id = toastId++;
    setToasts((prevToasts) => [...prevToasts, { id, message, icon: defaultIcons[icon] || defaultIcons.info, duration }]);
    setTimeout(() => removeToast(id), duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};