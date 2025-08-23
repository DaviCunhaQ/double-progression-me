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
    <DialogBase title="Compartilhe Seu Planejamento de Treino" isOpen={isOpen} onClose={onClose}>
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {copied ? "Copiado!" : "Copiar Treino"}
      </button>
    </DialogBase>
  );
}
