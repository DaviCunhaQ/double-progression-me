// src/components/ImportModal.tsx
import { useState } from "react";
import DialogBase from "./DialogBase";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportModal({
  isOpen,
  onClose,
  onImport,
}: ImportModalProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.trainingData || !parsed.execData) {
        throw new Error("Formato inválido");
      }
      localStorage.setItem("finalData", JSON.stringify(parsed));
      onImport();
      onClose();
    } catch {
      setError("JSON inválido! Verifique o formato.");
    }
  };

  return (
    <DialogBase title="Importar Planejamento" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="text-gray-600">
          <p className="mb-2">Cole aqui o JSON do treino que você recebeu</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dados do Treino
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder='{"trainingData": [...], "execData": [...]}'
            className="w-full h-32 border border-gray-300 rounded-xl p-4 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!input.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center justify-center gap-2">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Importar Treino
          </div>
        </button>
      </div>
    </DialogBase>
  );
}
