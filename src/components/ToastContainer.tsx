import { FunctionalComponent } from 'preact';
import { useToast } from '../contexts/ToastContext';

const ToastContainer: FunctionalComponent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast show">
          <div id="img"><i className={toast.icon}></i></div>
          <div id="desc">{toast.message}</div>
          <button onClick={() => removeToast(toast.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;