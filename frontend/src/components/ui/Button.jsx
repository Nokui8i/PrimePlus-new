import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  // Base styles
  const baseStyles = "inline-flex justify-center items-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Variant styles (primary, secondary, success, danger, etc.)
  const variantStyles = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border border-transparent",
    secondary: "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 border border-transparent",
    outline: "text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500 border border-gray-300",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 border border-transparent",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border border-transparent",
    text: "text-indigo-600 bg-transparent hover:text-indigo-800 focus:ring-indigo-500"
  };
  
  // Size styles
  const sizeStyles = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-3 px-6 text-base"
  };
  
  // Full width style
  const widthStyle = fullWidth ? "w-full" : "";
  
  // Disabled style
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${widthStyle}
        ${disabledStyle}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;