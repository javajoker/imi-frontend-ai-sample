// User types based on the tech spec
export type UserType = "creator" | "secondary_creator" | "buyer" | "admin";
export type VerificationLevel = "unverified" | "verified" | "premium";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string;
  username: string;
  email: string;
  user_type: UserType;
  verification_level: VerificationLevel;
  status: UserStatus;
  profile_data: {
    display_name: string;
    bio: string;
    avatar: string;
    portfolio_count?: number;
    total_revenue?: number;
    rating?: number;
    products_created?: number;
    licenses_held?: number;
    orders_count?: number;
    total_spent?: number;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  profileData?: Record<string, any>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Permission system
export type Permission =
  // User management
  | "manage_users"
  | "view_user_details"
  | "suspend_users"
  | "verify_users"
  // Content management
  | "verify_ip"
  | "moderate_content"
  | "resolve_disputes"
  // License management
  | "approve_licenses"
  | "revoke_licenses"
  | "view_license_details"
  // Transaction management
  | "view_transactions"
  | "process_refunds"
  | "resolve_payment_issues"
  // Platform management
  | "platform_settings"
  | "view_analytics"
  | "manage_notifications"
  // System administration
  | "audit_logs"
  | "generate_reports"
  | "system_maintenance"
  // Creator permissions
  | "create_ip"
  | "manage_licenses"
  | "view_analytics"
  // Secondary creator permissions
  | "apply_license"
  | "create_products"
  | "manage_inventory"
  // Buyer permissions
  | "purchase_products"
  | "verify_authenticity";

export interface UserPermissions {
  [key: string]: Permission[];
}

export const USER_PERMISSIONS: UserPermissions = {
  creator: ["create_ip", "manage_licenses", "view_analytics"],
  secondary_creator: ["apply_license", "create_products", "manage_inventory"],
  buyer: ["purchase_products", "verify_authenticity"],
  admin: [
    "manage_users",
    "view_user_details",
    "suspend_users",
    "verify_users",
    "verify_ip",
    "moderate_content",
    "resolve_disputes",
    "approve_licenses",
    "revoke_licenses",
    "view_license_details",
    "view_transactions",
    "process_refunds",
    "resolve_payment_issues",
    "platform_settings",
    "view_analytics",
    "manage_notifications",
    "audit_logs",
    "generate_reports",
    "system_maintenance",
  ],
};
