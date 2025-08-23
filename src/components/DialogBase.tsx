// src/components/DialogBase.tsx
import { ReactNode } from "react";

interface DialogBaseProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function DialogBase({ title, children, isOpen, onClose }: DialogBaseProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
