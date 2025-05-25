import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { APIResponse } from "../types";
import toast from "react-hot-toast";

// API base configuration
const API_BASE_URL =
import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";
const USE_MOCK_DATA =
import.meta.env.VITE_USE_MOCK_DATA === "true" ||
import.meta.env.VITE_ENVIRONMENT === "development";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config?.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message =
        (error.response.data as any)?.error?.message || "An error occurred";

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error("You are not authorized to perform this action.");
          break;
        case 404:
          toast.error("The requested resource was not found.");
          break;
        case 422:
          toast.error("Please check your input and try again.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: async <T>(url: string, params?: any): Promise<APIResponse<T>> => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    const response = await apiClient.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
    const response = await apiClient.patch(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<APIResponse<T>> => {
    const response = await apiClient.delete(url);
    return response.data;
  },

  upload: async <T>(
    url: string,
    formData: FormData
  ): Promise<APIResponse<T>> => {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Mock API delay for development
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper to determine if we should use mock data
export const shouldUseMockData = (): boolean => {
  return USE_MOCK_DATA;
};

// Pagination helper
export const buildPaginationParams = (
  page: number = 1,
  limit: number = 20,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  return {
    page,
    limit,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  };
};

// Error helper
export const extractErrorMessage = (error: any): string => {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export default apiClient;
