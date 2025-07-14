import React from 'react';

interface MinimalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const MinimalButton: React.FC<MinimalButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`font-serif border border-gray-200 text-neutral-900 bg-white rounded-md px-5 py-2 text-base font-normal transition-colors duration-150 hover:bg-[#f6f2ff] focus:outline-none focus:ring-2 focus:ring-purple-200 active:bg-[#ede7f6] ${className}`}
      style={{ fontFamily: 'Playfair Display, serif', borderWidth: 1 }}
      {...props}
    >
      {children}
    </button>
  );
};

export default MinimalButton;
