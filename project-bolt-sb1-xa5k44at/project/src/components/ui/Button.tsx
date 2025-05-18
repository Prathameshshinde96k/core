import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "success" | "warning" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  children,
  className = "",
  ...props
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  // Size styles
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-lg",
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 focus-visible:ring-purple-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 focus-visible:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-500",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600 dark:text-blue-400 hover:bg-transparent focus-visible:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 focus-visible:ring-green-500",
    warning: "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 focus-visible:ring-amber-500",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-500",
  };
  
  const styles = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button className={styles} {...props}>
      {icon && <span className={`${children ? "mr-2" : ""}`}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;