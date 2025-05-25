import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  placeholder?: string;
  delay?: number;
  showClearButton?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search...",
  delay = 300,
  showClearButton = true,
  isLoading = false,
  size = "md",
  className,
  disabled = false,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, delay);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
      if (onSearch) {
        onSearch(debouncedValue);
      }
    }
  }, [debouncedValue, onChange, onSearch, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(inputValue);
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const sizeClasses = {
    sm: "pl-8 pr-8 py-1.5 text-sm",
    md: "pl-10 pr-10 py-2 text-base",
    lg: "pl-12 pr-12 py-3 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconPositions = {
    sm: "left-2",
    md: "left-3",
    lg: "left-4",
  };

  const clearButtonPositions = {
    sm: "right-2",
    md: "right-3",
    lg: "right-4",
  };

  return (
    <div className={clsx("relative", className)}>
      {/* Search Icon */}
      <div
        className={clsx(
          "absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none",
          iconPositions[size]
        )}
      >
        <Search className={iconSizes[size]} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={clsx(
          "w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
          sizeClasses[size],
          disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          showClearButton && inputValue && "pr-16"
        )}
      />

      {/* Clear Button */}
      {showClearButton && inputValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={clsx(
            "absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded",
            clearButtonPositions[size]
          )}
        >
          <X className={iconSizes[size]} />
        </button>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div
          className={clsx(
            "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
            showClearButton && inputValue
              ? "right-8"
              : clearButtonPositions[size]
          )}
        >
          <Loader2 className={clsx(iconSizes[size], "animate-spin")} />
        </div>
      )}
    </div>
  );
};

// Search input with suggestions
interface SearchWithSuggestionsProps extends SearchInputProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

export const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  showSuggestions = true,
  maxSuggestions = 5,
  ...searchProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(searchProps.value?.toLowerCase() || "")
    )
    .slice(0, maxSuggestions);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          onSuggestionClick(filteredSuggestions[selectedIndex]);
          setIsOpen(false);
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative">
      <SearchInput
        {...searchProps}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
      />

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={clsx(
                "w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                index === selectedIndex && "bg-primary-50 text-primary-600",
                index === 0 && "rounded-t-lg",
                index === filteredSuggestions.length - 1 && "rounded-b-lg"
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
