// Re-export auth types
export * from "./auth";

// Common status types
export type Status =
  | "active"
  | "suspended"
  | "deleted"
  | "pending"
  | "approved"
  | "rejected";
export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";
export type LicenseStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revoked"
  | "expired";

// IP Asset types
export interface IPAsset {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
  file_urls: string[];
  metadata: {
    dimensions?: string;
    file_size?: string;
    color_profile?: string;
    format?: string;
    repeatable?: boolean;
    colors?: number;
    tags?: string[];
    [key: string]: any;
  };
  verification_status: "pending" | "approved" | "rejected";
  blockchain_hash?: string;
  status: Status;
  created_at: string;
  updated_at: string;
  stats?: {
    views: number;
    license_applications: number;
    active_licenses: number;
  };
}

// License Terms types
export type LicenseType = "standard" | "premium" | "exclusive";

export interface LicenseTerms {
  id: string;
  ip_asset_id: string;
  license_type: LicenseType;
  revenue_share_percentage: number;
  base_fee: number;
  territory: string;
  duration: string;
  requirements: string;
  restrictions: string;
  auto_approve: boolean;
  created_at: string;
}

// License Application types
export interface LicenseApplication {
  id: string;
  ip_asset_id: string;
  applicant_id: string;
  license_terms_id: string;
  application_data: {
    intended_use: string;
    portfolio_links?: string[];
    business_description: string;
    [key: string]: any;
  };
  status: LicenseStatus;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Product types
export interface Product {
  id: string;
  creator_id: string;
  license_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  inventory_count: number;
  images: string[];
  specifications: {
    material?: string;
    sizes?: string[];
    colors?: string[];
    dimensions?: string;
    weight?: string;
    care_instructions?: string;
    [key: string]: any;
  };
  status: Status;
  authenticity_verified: boolean;
  created_at: string;
  updated_at: string;
  stats?: {
    views: number;
    purchases: number;
    rating: number;
    reviews_count: number;
  };
}

// Transaction types
export type TransactionType = "product_sale" | "license_fee" | "revenue_share";

export interface Transaction {
  id: string;
  transaction_type: TransactionType;
  buyer_id: string;
  seller_id: string;
  product_id?: string;
  amount: number;
  platform_fee: number;
  revenue_shares: {
    seller?: number;
    ip_creator?: number;
    platform?: number;
    [key: string]: number | undefined;
  };
  payment_method: string;
  payment_reference?: string;
  status: TransactionStatus;
  processed_at?: string;
  created_at: string;
}

// Authorization Chain types
export interface AuthorizationChain {
  id: string;
  product_id: string;
  ip_asset_id: string;
  license_id: string;
  parent_chain_id?: string;
  blockchain_hash: string;
  verification_code: string;
  is_active: boolean;
  created_at: string;
}

// Analytics types
export interface PlatformAnalytics {
  overview: {
    total_users: number;
    active_users: number;
    total_ip_assets: number;
    total_products: number;
    total_revenue: number;
    platform_fees: number;
  };
  growth: {
    user_growth: number;
    revenue_growth: number;
    transaction_growth: number;
  };
}

// Admin types
export interface AdminNotification {
  id: string;
  type: "system" | "user_action" | "content_report" | "payment_issue";
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "unread" | "read" | "dismissed";
  related_resource_type?: string;
  related_resource_id?: string;
  created_at: string;
  read_at?: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reported_content_type: "ip_asset" | "product" | "user" | "review";
  reported_content_id: string;
  reason: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  admin_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  category?: string;
  status?: string;
  user_type?: string;
  price_min?: number;
  price_max?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Form types
export interface IPRegistrationForm {
  title: string;
  description: string;
  category: string;
  content_type: string;
  files: File[];
  tags: string[];
  license_terms: {
    base_fee: number;
    revenue_share_percentage: number;
    requirements: string;
    restrictions: string;
  };
}

export interface ProductCreationForm {
  license_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  inventory_count: number;
  images: File[];
  specifications: Record<string, any>;
}

export interface LicenseApplicationForm {
  intended_use: string;
  portfolio_links: string[];
  business_description: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentInfo {
  method: "credit_card" | "paypal" | "crypto";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
  cryptoAddress?: string;
}

// Settings types
export interface PlatformSettings {
  general: {
    platform_name: string;
    platform_description: string;
    support_email: string;
    maintenance_mode: boolean;
    allow_new_registrations: boolean;
    require_email_verification: boolean;
  };
  payments: {
    platform_fee_percentage: number;
    minimum_payout: number;
    payout_schedule: "daily" | "weekly" | "monthly";
    stripe_publishable_key: string;
    paypal_enabled: boolean;
    crypto_enabled: boolean;
  };
  verification: {
    auto_verify_creators: boolean;
    require_portfolio_for_creators: boolean;
    require_business_docs_for_premium: boolean;
    verification_fee: number;
    manual_review_threshold: number;
  };
  content: {
    auto_approve_ips: boolean;
    ai_content_detection: boolean;
    copyright_check_enabled: boolean;
    max_file_size: number;
    allowed_file_types: string[];
    content_moderation_level: "relaxed" | "moderate" | "strict";
  };
  security: {
    two_factor_required: boolean;
    session_timeout: number;
    password_min_length: number;
    password_require_special_chars: boolean;
    max_login_attempts: number;
  };
}
