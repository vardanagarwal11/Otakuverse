import React from "react";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-otaku-purple/90 to-otaku-blue/90 rounded-2xl shadow-2xl p-8 max-w-lg w-full border-4 border-otaku-pink animate-fadeInUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-otaku-pink text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center text-center">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-4 animate-bounce">
            <circle cx="40" cy="40" r="38" stroke="#934EFB" strokeWidth="4" fill="#18122B" />
            <path d="M24 40h32" stroke="#14F194" strokeWidth="4" strokeLinecap="round" />
            <path d="M40 24v32" stroke="#14F194" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 className="text-4xl font-cyber font-bold neon-text-pink mb-2">Coming Soon!</h2>
          <p className="text-lg text-white/80 mb-4 font-cyber">
            The Creator Studio is launching soon.<br />
            Stay tuned for powerful tools to empower anime creators!
          </p>

        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
