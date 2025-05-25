import { useState, useCallback } from "react";

type ValidationRule<T> = (value: T) => string | null;
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (newValues: Partial<T>) => void;
  validate: (field?: keyof T) => boolean;
  validateAll: () => boolean;
  reset: () => void;
  clearErrors: () => void;
  clearError: (field: keyof T) => void;
}

// Hook for form validation
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | null => {
      const rules = validationRules[field];
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule(value as any);
        if (error) return error;
      }
      return null;
    },
    [validationRules]
  );

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const validate = useCallback(
    (field?: keyof T): boolean => {
      if (field) {
        const error = validateField(field, values[field]);
        if (error) {
          setErrors((prev) => ({ ...prev, [field]: error }));
          return false;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          return true;
        }
      } else {
        return validateAll();
      }
    },
    [values, validateField]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
  }, [initialValues]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isValid,
    setValue,
    setValues,
    validate,
    validateAll,
    reset,
    clearErrors,
    clearError,
  };
}

// Common validation rules
export const validationRules = {
  required:
    (message = "This field is required") =>
    (value: any) => {
      if (value === null || value === undefined || value === "") {
        return message;
      }
      return null;
    },

  email:
    (message = "Please enter a valid email address") =>
    (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return message;
      }
      return null;
    },

  minLength: (length: number, message?: string) => (value: string) => {
    if (value && value.length < length) {
      return message || `Must be at least ${length} characters`;
    }
    return null;
  },

  maxLength: (length: number, message?: string) => (value: string) => {
    if (value && value.length > length) {
      return message || `Must be no more than ${length} characters`;
    }
    return null;
  },

  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  min: (min: number, message?: string) => (value: number) => {
    if (typeof value === "number" && value < min) {
      return message || `Must be at least ${min}`;
    }
    return null;
  },

  max: (max: number, message?: string) => (value: number) => {
    if (typeof value === "number" && value > max) {
      return message || `Must be no more than ${max}`;
    }
    return null;
  },

  url:
    (message = "Please enter a valid URL") =>
    (value: string) => {
      try {
        if (value) {
          new URL(value);
        }
        return null;
      } catch {
        return message;
      }
    },
};
