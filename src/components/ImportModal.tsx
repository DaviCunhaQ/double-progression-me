// src/components/ImportModal.tsx
import { useState } from "react";
import DialogBase from "./DialogBase";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Cole aqui o JSON do treino"
        className="w-full h-32 border p-2 rounded"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        onClick={handleImport}
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Enviar
      </button>
    </DialogBase>
  );
}
