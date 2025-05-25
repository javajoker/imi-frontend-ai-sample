import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User, UserType, AuthState } from "../types/auth";
import { authService } from "../services/authService";
import { mockUsers } from "../data/mockData";
import toast from "react-hot-toast";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Action types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  switchUser: (userId: string) => void; // For demo purposes
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  userType: UserType;
  profileData?: Record<string, any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
interface AuthProviderProps {
  children: ReactNode | ReactNode[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // In a real app, verify token with backend
          // For demo, use stored user data
          const userData = localStorage.getItem("userData");
          if (userData) {
            const user = JSON.parse(userData);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
          } else {
            dispatch({ type: "SET_LOADING", payload: false });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // In production, this would call the actual API
      // For demo, simulate login with mock data
      const user = mockUsers.find((u) => u.email === email);

      if (!user) {
        throw new Error("User not found");
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("userData", JSON.stringify(user));

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      toast.success(`Welcome back, ${user.profile_data.display_name}!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // In production, this would call the actual API
      // For demo, create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        user_type: userData.userType,
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

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("userData", JSON.stringify(newUser));

      dispatch({ type: "LOGIN_SUCCESS", payload: newUser });
      toast.success(
        `Welcome to IPMarket, ${newUser.profile_data.display_name}!`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: "UPDATE_USER", payload: userData });

    // Update stored user data
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  // Demo function to switch between different user types
  const switchUser = (userId: string): void => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      toast.success(`Switched to ${user.profile_data.display_name}`);
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    register,
    updateUser,
    switchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
