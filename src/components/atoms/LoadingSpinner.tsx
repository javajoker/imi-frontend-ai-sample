import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  fullScreen = false,
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-200 border-t-2 border-t-primary-500 rounded-full animate-spin`}
        />
        {text && <p className="text-sm text-gray-600">{text}</p>}
        {!text && fullScreen && (
          <p className="text-sm text-gray-600">{t("common.loading")}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
