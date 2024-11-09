import React, { ReactNode } from "react";

interface OCButtonProps {
  onClick: () => void; 
  children: ReactNode;
}

const OCButton: React.FC<OCButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white rounded-full border border-gray-300 px-6 py-2"
    >
      <div className="flex items-center justify-center space-x-2">
        <div className="text-xl">{children}</div>
      </div>
    </button>
  );
};

export default OCButton;
