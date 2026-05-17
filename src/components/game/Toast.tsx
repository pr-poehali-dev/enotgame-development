import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'border-green-500/50 bg-green-500/10 text-green-300',
    error: 'border-red-500/50 bg-red-500/10 text-red-300',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
  };

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border backdrop-blur-xl text-sm font-semibold transition-all duration-300 ${colors[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      {message}
    </div>
  );
}
