'use client'
import React, { useEffect } from 'react';

interface ToastProps {
  title:string;
  message: string;
  duration: number;
  variant?: 'default' | 'success' | 'destructive';
  onClose: () => void;
}

const Toast = ({ title, message, duration, variant = 'default', onClose }:ToastProps) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variantClasses = {
    default: 'bg-white text-gray-800',
    success: 'bg-green-500 text-white',
    destructive: 'bg-red-500 text-white',
  };

  return (
    <div className={`z-50 fixed top-4 right-4 py-2 px-4 rounded-lg shadow-lg border border-white  ${variantClasses[variant]}`}>
      <h1 className='text-2xl font-bold'>{title}</h1>
      {message}
    </div>
  );
};

export default Toast;
