// src/components/ShareModal.tsx
import { useState } from "react";
import DialogBase from "./DialogBase";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const data = localStorage.getItem("finalData") || "{}";
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DialogBase
      title="Compartilhar Planejamento"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-center space-y-6">
        <div className="text-gray-600">
          <p className="mb-2">
            Copie seu planejamento de treino para compartilhar com outros
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            copied
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {copied ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copiado com sucesso!
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar Treino
              </>
            )}
          </div>
        </button>
      </div>
    </DialogBase>
  );
}
