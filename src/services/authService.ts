import { api, shouldUseMockData, mockDelay } from "./apiClient";
import { AuthResponse, LoginCredentials, User } from "../types/auth";
import { mockUsers } from "../data/mockData";

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (shouldUseMockData()) {
      await mockDelay();

      // Mock login logic
      const user = mockUsers.find((u) => u.email === credentials.email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      return {
        user,
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
      };
    }

    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data!;
  },

  // Register user
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    userType: string;
    profileData?: Record<string, any>;
  }): Promise<AuthResponse> => {
    if (shouldUseMockData()) {
      await mockDelay();

      // Mock register logic
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        user_type: userData.userType as any,
        verification_level: "unverified",
        status: "active",
        profile_data: {
          display_name: userData.username,
          bio: "",
          avatar: "/api/placeholder/150/150",
          ...userData.profileData,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        user: newUser,
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
      };
    }

    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data!;
  },

  // Logout user
  logout: async (): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay(200);
      return;
    }

    await api.post("/auth/logout");
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    if (shouldUseMockData()) {
      await mockDelay();

      // Mock refresh - return current user data
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        return {
          user,
          token: "mock-jwt-token-refreshed",
          refreshToken: "mock-refresh-token-refreshed",
        };
      }
      throw new Error("No user data found");
    }

    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data!;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.post("/auth/forgot-password", { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.post("/auth/reset-password", { token, password });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.get(`/auth/verify-email/${token}`);
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const userData = localStorage.getItem("userData");
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error("No user data found");
    }

    const response = await api.get<User>("/auth/me");
    return response.data!;
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const userData = localStorage.getItem("userData");
      if (userData) {
        const currentUser = JSON.parse(userData);
        const updatedUser = {
          ...currentUser,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error("No user data found");
    }

    const response = await api.put<User>("/auth/profile", updates);
    return response.data!;
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.post("/auth/change-password", { currentPassword, newPassword });
  },
};
