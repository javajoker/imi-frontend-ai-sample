import {
  User,
  IPAsset,
  LicenseTerms,
  LicenseApplication,
  Product,
  Transaction,
  AuthorizationChain,
  PlatformAnalytics,
  AdminNotification,
} from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    username: "artisan_creator",
    email: "creator@example.com",
    user_type: "creator",
    verification_level: "verified",
    status: "active",
    profile_data: {
      display_name: "Digital Artisan",
      bio: "Professional digital artist with 10+ years experience",
      avatar: "/api/placeholder/150/150",
      portfolio_count: 45,
      total_revenue: 12500,
      rating: 4.8,
    },
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    username: "product_maker",
    email: "maker@example.com",
    user_type: "secondary_creator",
    verification_level: "verified",
    status: "active",
    profile_data: {
      display_name: "Product Maker Co",
      bio: "Creating quality products with licensed artwork",
      avatar: "/api/placeholder/150/150",
      products_created: 23,
      licenses_held: 8,
      rating: 4.6,
      total_revenue: 8500,
    },
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "3",
    username: "buyer_jane",
    email: "buyer@example.com",
    user_type: "buyer",
    verification_level: "verified",
    status: "active",
    profile_data: {
      display_name: "Jane Smith",
      bio: "Art collector and enthusiast",
      avatar: "/api/placeholder/150/150",
      orders_count: 15,
      total_spent: 850,
      rating: 4.9,
    },
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "4",
    username: "admin_user",
    email: "admin@example.com",
    user_type: "admin",
    verification_level: "premium",
    status: "active",
    profile_data: {
      display_name: "Platform Admin",
      bio: "Platform administrator",
      avatar: "/api/placeholder/150/150",
    },
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
];

// Mock IP Assets
export const mockIPAssets: IPAsset[] = [
  {
    id: "1",
    creator_id: "1",
    title: "Sunset Mountain Landscape",
    description:
      "Beautiful digital artwork featuring a serene mountain landscape at sunset with vibrant colors",
    category: "Digital Art",
    content_type: "image",
    file_urls: ["/api/placeholder/400/300"],
    metadata: {
      dimensions: "4000x3000",
      file_size: "2.5MB",
      color_profile: "sRGB",
      tags: ["landscape", "sunset", "mountains", "nature"],
    },
    verification_status: "approved",
    blockchain_hash: "0x1234567890abcdef",
    status: "active",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    stats: {
      views: 1250,
      license_applications: 8,
      active_licenses: 3,
    },
  },
  {
    id: "2",
    creator_id: "1",
    title: "Abstract Geometric Pattern",
    description:
      "Modern geometric pattern perfect for textile and product design",
    category: "Pattern Design",
    content_type: "vector",
    file_urls: ["/api/placeholder/400/400"],
    metadata: {
      format: "SVG",
      repeatable: true,
      colors: 5,
      tags: ["geometric", "abstract", "pattern", "modern"],
    },
    verification_status: "approved",
    blockchain_hash: "0xabcdef1234567890",
    status: "active",
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z",
    stats: {
      views: 890,
      license_applications: 12,
      active_licenses: 5,
    },
  },
  {
    id: "3",
    creator_id: "1",
    title: "Vintage Floral Design",
    description:
      "Elegant vintage-inspired floral pattern with intricate details",
    category: "Pattern Design",
    content_type: "image",
    file_urls: ["/api/placeholder/400/400"],
    metadata: {
      dimensions: "3000x3000",
      file_size: "3.2MB",
      color_profile: "sRGB",
      tags: ["vintage", "floral", "elegant", "pattern"],
    },
    verification_status: "pending",
    status: "active",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
    stats: {
      views: 450,
      license_applications: 3,
      active_licenses: 0,
    },
  },
];

// Mock License Terms
export const mockLicenseTerms: LicenseTerms[] = [
  {
    id: "1",
    ip_asset_id: "1",
    license_type: "standard",
    revenue_share_percentage: 15.0,
    base_fee: 50.0,
    territory: "Global",
    duration: "2 years",
    requirements: "Portfolio review required, minimum 5 previous products",
    restrictions: "No adult content, no competing artwork",
    auto_approve: false,
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    ip_asset_id: "1",
    license_type: "premium",
    revenue_share_percentage: 25.0,
    base_fee: 150.0,
    territory: "Global",
    duration: "5 years",
    requirements: "Verified seller status, minimum 20 previous products",
    restrictions: "No adult content, exclusive category protection",
    auto_approve: false,
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    ip_asset_id: "2",
    license_type: "standard",
    revenue_share_percentage: 12.0,
    base_fee: 30.0,
    territory: "Global",
    duration: "3 years",
    requirements: "Basic portfolio review",
    restrictions: "No adult content",
    auto_approve: true,
    created_at: "2024-02-05T10:00:00Z",
  },
];

// Mock License Applications
export const mockLicenseApplications: LicenseApplication[] = [
  {
    id: "1",
    ip_asset_id: "1",
    applicant_id: "2",
    license_terms_id: "1",
    application_data: {
      intended_use: "T-shirt and apparel design",
      portfolio_links: ["https://example.com/portfolio"],
      business_description:
        "Online apparel store specializing in nature-themed designs",
    },
    status: "approved",
    approved_at: "2024-02-10T10:00:00Z",
    approved_by: "1",
    created_at: "2024-02-08T10:00:00Z",
    updated_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    ip_asset_id: "2",
    applicant_id: "2",
    license_terms_id: "3",
    application_data: {
      intended_use: "Home decor products - cushions and wall art",
      portfolio_links: [
        "https://example.com/portfolio",
        "https://example.com/gallery",
      ],
      business_description: "Home decor company focusing on modern design",
    },
    status: "pending",
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    creator_id: "2",
    license_id: "1",
    title: "Sunset Mountain T-Shirt",
    description:
      "Premium cotton t-shirt featuring licensed sunset mountain artwork",
    category: "Apparel",
    price: 29.99,
    inventory_count: 50,
    images: ["/api/placeholder/400/400", "/api/placeholder/400/400"],
    specifications: {
      material: "100% Cotton",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Navy"],
      care_instructions: "Machine wash cold",
    },
    status: "active",
    authenticity_verified: true,
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    stats: {
      views: 456,
      purchases: 23,
      rating: 4.7,
      reviews_count: 8,
    },
  },
  {
    id: "2",
    creator_id: "2",
    license_id: "1",
    title: "Mountain Landscape Canvas Print",
    description:
      "High-quality canvas print of licensed mountain landscape artwork",
    category: "Home Decor",
    price: 89.99,
    inventory_count: 25,
    images: ["/api/placeholder/400/300"],
    specifications: {
      size: "24x18 inches",
      material: "Canvas",
      frame: "Gallery wrapped",
      ready_to_hang: true,
    },
    status: "active",
    authenticity_verified: true,
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
    stats: {
      views: 234,
      purchases: 12,
      rating: 4.9,
      reviews_count: 5,
    },
  },
  {
    id: "3",
    creator_id: "2",
    license_id: "1",
    title: "Nature-Inspired Phone Case",
    description: "Durable phone case with mountain landscape design",
    category: "Accessories",
    price: 19.99,
    inventory_count: 100,
    images: ["/api/placeholder/300/400"],
    specifications: {
      material: "TPU with hard back",
      compatibility: ["iPhone 14", "iPhone 13", "Samsung Galaxy S23"],
      colors: ["Clear", "White", "Black"],
      protection: "Drop protection up to 6 feet",
    },
    status: "active",
    authenticity_verified: true,
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
    stats: {
      views: 189,
      purchases: 15,
      rating: 4.5,
      reviews_count: 3,
    },
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    transaction_type: "product_sale",
    buyer_id: "3",
    seller_id: "2",
    product_id: "1",
    amount: 29.99,
    platform_fee: 2.99,
    revenue_shares: {
      seller: 22.5,
      ip_creator: 4.5,
      platform: 2.99,
    },
    payment_method: "credit_card",
    payment_reference: "pi_1234567890",
    status: "completed",
    processed_at: "2024-03-15T10:00:00Z",
    created_at: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    transaction_type: "license_fee",
    buyer_id: "2",
    seller_id: "1",
    amount: 50.0,
    platform_fee: 5.0,
    revenue_shares: {
      seller: 45.0,
      platform: 5.0,
    },
    payment_method: "credit_card",
    status: "completed",
    processed_at: "2024-02-10T10:00:00Z",
    created_at: "2024-02-08T10:00:00Z",
  },
  {
    id: "3",
    transaction_type: "product_sale",
    buyer_id: "3",
    seller_id: "2",
    product_id: "2",
    amount: 89.99,
    platform_fee: 8.99,
    revenue_shares: {
      seller: 67.5,
      ip_creator: 13.5,
      platform: 8.99,
    },
    payment_method: "paypal",
    status: "completed",
    processed_at: "2024-03-13T14:15:00Z",
    created_at: "2024-03-13T14:15:00Z",
  },
];

// Mock Authorization Chain
export const mockAuthorizationChain: AuthorizationChain[] = [
  {
    id: "1",
    product_id: "1",
    ip_asset_id: "1",
    license_id: "1",
    blockchain_hash: "0xchain1234567890",
    verification_code: "VER-MT-001-2024",
    is_active: true,
    created_at: "2024-02-15T10:00:00Z",
  },
  {
    id: "2",
    product_id: "2",
    ip_asset_id: "1",
    license_id: "1",
    blockchain_hash: "0xchain0987654321",
    verification_code: "VER-MT-002-2024",
    is_active: true,
    created_at: "2024-02-20T10:00:00Z",
  },
  {
    id: "3",
    product_id: "3",
    ip_asset_id: "1",
    license_id: "1",
    blockchain_hash: "0xchain1122334455",
    verification_code: "VER-MT-003-2024",
    is_active: true,
    created_at: "2024-03-05T10:00:00Z",
  },
];

// Mock Platform Analytics
export const mockPlatformAnalytics: PlatformAnalytics = {
  overview: {
    total_users: 15430,
    active_users: 8650,
    total_ip_assets: 2340,
    total_products: 890,
    total_revenue: 125000,
    platform_fees: 12500,
  },
  growth: {
    user_growth: 15.2,
    revenue_growth: 23.8,
    transaction_growth: 18.5,
  },
};

// Mock Admin Notifications
export const mockAdminNotifications: AdminNotification[] = [
  {
    id: "1",
    type: "content_report",
    title: "Copyright Infringement Report",
    message: "User reported potential copyright violation on IP Asset #2341",
    priority: "high",
    status: "unread",
    related_resource_type: "ip_asset",
    related_resource_id: "2341",
    created_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    type: "user_action",
    title: "New Premium Verification Request",
    message: 'User "designer_pro" requested premium verification status',
    priority: "medium",
    status: "unread",
    related_resource_type: "user",
    related_resource_id: "156",
    created_at: "2024-03-19T14:30:00Z",
  },
  {
    id: "3",
    type: "payment_issue",
    title: "Payment Processing Error",
    message: "Large transaction failed due to payment gateway timeout",
    priority: "critical",
    status: "read",
    related_resource_type: "transaction",
    related_resource_id: "9876",
    created_at: "2024-03-18T09:15:00Z",
    read_at: "2024-03-18T09:30:00Z",
  },
  {
    id: "4",
    type: "system",
    title: "System Maintenance Scheduled",
    message: "Planned maintenance window scheduled for this weekend",
    priority: "medium",
    status: "read",
    created_at: "2024-03-17T16:00:00Z",
    read_at: "2024-03-17T16:05:00Z",
  },
];

// Consolidated mock data export
export const mockData = {
  users: mockUsers,
  ip_assets: mockIPAssets,
  license_terms: mockLicenseTerms,
  license_applications: mockLicenseApplications,
  products: mockProducts,
  transactions: mockTransactions,
  authorization_chain: mockAuthorizationChain,
  platform_analytics: mockPlatformAnalytics,
  admin_notifications: mockAdminNotifications,
};

// Helper functions for filtering and searching
export const findUserById = (id: string): User | undefined =>
  mockUsers.find((user) => user.id === id);

export const findIPAssetById = (id: string): IPAsset | undefined =>
  mockIPAssets.find((asset) => asset.id === id);

export const findProductById = (id: string): Product | undefined =>
  mockProducts.find((product) => product.id === id);

export const findLicenseApplicationById = (
  id: string
): LicenseApplication | undefined =>
  mockLicenseApplications.find((app) => app.id === id);

export const findAuthorizationByCode = (
  code: string
): AuthorizationChain | undefined =>
  mockAuthorizationChain.find((auth) => auth.verification_code === code);

export const getIPAssetsByCreator = (creatorId: string): IPAsset[] =>
  mockIPAssets.filter((asset) => asset.creator_id === creatorId);

export const getProductsByCreator = (creatorId: string): Product[] =>
  mockProducts.filter((product) => product.creator_id === creatorId);

export const getLicenseApplicationsByApplicant = (
  applicantId: string
): LicenseApplication[] =>
  mockLicenseApplications.filter((app) => app.applicant_id === applicantId);

export const getLicenseApplicationsForCreator = (
  creatorId: string
): LicenseApplication[] =>
  mockLicenseApplications.filter((app) => {
    const ipAsset = findIPAssetById(app.ip_asset_id);
    return ipAsset?.creator_id === creatorId;
  });

export const getTransactionsByUser = (userId: string): Transaction[] =>
  mockTransactions.filter(
    (tx) => tx.buyer_id === userId || tx.seller_id === userId
  );
