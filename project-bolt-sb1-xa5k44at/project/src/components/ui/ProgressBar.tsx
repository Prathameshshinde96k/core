import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = false,
  className = "",
  variant = "default",
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const variantStyles = {
    default: "bg-blue-600 dark:bg-blue-500",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-amber-600 dark:bg-amber-500",
    danger: "bg-red-600 dark:bg-red-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;