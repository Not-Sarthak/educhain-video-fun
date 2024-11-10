import React, { ReactNode } from "react";

interface OCButtonProps {
  onClick: () => void; 
  children: ReactNode;
}

const OCButton: React.FC<OCButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white px-4 py-2 rounded-smooth hover:bg-primary/90 transition-colors"
    >
      <div className="flex items-center justify-center space-x-2">
        {children}
      </div>
    </button>
  );
};

export default OCButton;
