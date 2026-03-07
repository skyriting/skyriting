import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-red-600/20"
        >
          Done
        </button>
      </div>
    </div>
  );
}
