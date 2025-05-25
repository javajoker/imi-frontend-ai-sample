import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";
import Button from "../atoms/Button";

interface ImageUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  description?: string;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
}

interface FileWithPreview extends File {
  preview?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  accept = "image/*",
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
  error,
  label,
  description,
  showPreview = true,
  previewSize = "md",
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File "${
          file.name
        }" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
      }

      // Check file type
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type === "*") return true;
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return (
          file.type === type ||
          file.name.toLowerCase().endsWith(type.replace(".", ""))
        );
      });

      if (!isValidType) {
        return `File "${file.name}" has an invalid type. Accepted types: ${accept}`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (files: FileList) => {
      const newFiles: FileWithPreview[] = [];
      const newErrors: string[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
          return;
        }

        const fileWithPreview = file as FileWithPreview;

        // Create preview for images
        if (file.type.startsWith("image/") && showPreview) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }

        newFiles.push(fileWithPreview);
      });

      // Check total file count
      const totalFiles = value.length + newFiles.length;
      if (totalFiles > maxFiles) {
        newErrors.push(
          `Cannot upload more than ${maxFiles} files. Current: ${value.length}, Adding: ${newFiles.length}`
        );
        return;
      }

      setErrors(newErrors);

      if (newFiles.length > 0 && newErrors.length === 0) {
        const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;
        onChange(updatedFiles);
      }
    },
    [value, validateFile, multiple, maxFiles, onChange, showPreview]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = value[index] as FileWithPreview;

    // Revoke object URL to prevent memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const previewSizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragOver && !disabled && "border-primary-400 bg-primary-50",
          !dragOver && !disabled && "border-gray-300 hover:border-gray-400",
          disabled &&
            "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60",
          (error || errors.length > 0) && "border-red-300 bg-red-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-2">
          <Upload
            className={clsx(
              "mx-auto h-12 w-12",
              disabled ? "text-gray-400" : "text-gray-500"
            )}
          />

          <div>
            <p
              className={clsx(
                "text-sm font-medium",
                disabled ? "text-gray-400" : "text-gray-700"
              )}
            >
              {dragOver
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {accept} up to {formatFileSize(maxSize)}
              {multiple && ` (max ${maxFiles} files)`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(error || errors.length > 0) && (
        <div className="space-y-1">
          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {errors.map((err, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm text-red-600"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {showPreview && value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({value.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {value.map((file, index) => {
              const fileWithPreview = file as FileWithPreview;
              const isImage = file.type.startsWith("image/");

              return (
                <div key={index} className="relative group">
                  <div
                    className={clsx(
                      "relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
                      previewSizes[previewSize]
                    )}
                  >
                    {isImage && fileWithPreview.preview ? (
                      <img
                        src={fileWithPreview.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isImage ? (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* File Info */}
                  <div
                    className="mt-1 text-xs text-gray-600 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File List (Alternative to Preview) */}
      {!showPreview && value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({value.length})
          </h4>
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
