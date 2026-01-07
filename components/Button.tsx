import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 border-2 border-black neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  
  const variants = {
    primary: "bg-[#b75555] text-white hover:bg-[#a04444]",
    secondary: "bg-white text-black hover:bg-gray-50",
    danger: "bg-black text-white hover:bg-gray-800",
    outline: "bg-transparent text-black hover:bg-white/50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};