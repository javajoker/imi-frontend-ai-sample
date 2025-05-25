import {
  api,
  shouldUseMockData,
  mockDelay,
  buildPaginationParams,
} from "./apiClient";
import {
  Product,
  ProductCreationForm,
  PaginationParams,
  FilterParams,
  APIResponse,
  AuthorizationChain,
} from "../types";
import {
  mockProducts,
  mockAuthorizationChain,
  getProductsByCreator,
  findAuthorizationByCode,
} from "../data/mockData";

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (
    pagination: PaginationParams = {},
    filters: FilterParams = {}
  ): Promise<APIResponse<Product[]>> => {
    if (shouldUseMockData()) {
      await mockDelay();

      let filteredProducts = [...mockProducts];

      // Apply filters
      if (filters.category) {
        filteredProducts = filteredProducts.filter((product) =>
          product.category
            .toLowerCase()
            .includes(filters.category!.toLowerCase())
        );
      }

      if (filters.search) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.title
              .toLowerCase()
              .includes(filters.search!.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(filters.search!.toLowerCase())
        );
      }

      if (filters.price_min !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= filters.price_min!
        );
      }

      if (filters.price_max !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= filters.price_max!
        );
      }

      if (filters.status) {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === filters.status
        );
      }

      // Apply sorting
      if (pagination.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (pagination.sortBy) {
            case "price":
              aValue = a.price;
              bValue = b.price;
              break;
            case "rating":
              aValue = a.stats?.rating || 0;
              bValue = b.stats?.rating || 0;
              break;
            case "created_at":
              aValue = new Date(a.created_at);
              bValue = new Date(b.created_at);
              break;
            default:
              aValue = (a as any)[pagination.sortBy!];
              bValue = (b as any)[pagination.sortBy!];
          }

          if (pagination.sortOrder === "desc") {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Apply pagination
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
        },
      };
    }

    const params = {
      ...buildPaginationParams(
        pagination.page,
        pagination.limit,
        pagination.sortBy,
        pagination.sortOrder
      ),
      ...filters,
    };

    return await api.get<Product[]>("/products", params);
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }

    const response = await api.get<Product>(`/products/${id}`);
    return response.data!;
  },

  // Create new product
  createProduct: async (productData: ProductCreationForm): Promise<Product> => {
    if (shouldUseMockData()) {
      await mockDelay(1000);

      const newProduct: Product = {
        id: Date.now().toString(),
        creator_id: "2", // Current user ID would come from auth context
        license_id: productData.license_id,
        title: productData.title,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        inventory_count: productData.inventory_count,
        images: ["/api/placeholder/400/400"], // Mock image URLs
        specifications: productData.specifications,
        status: "active",
        authenticity_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stats: {
          views: 0,
          purchases: 0,
          rating: 0,
          reviews_count: 0,
        },
      };

      return newProduct;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("license_id", productData.license_id);
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price.toString());
    formData.append("inventory_count", productData.inventory_count.toString());
    formData.append(
      "specifications",
      JSON.stringify(productData.specifications)
    );

    productData.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    const response = await api.upload<Product>("/products", formData);
    return response.data!;
  },

  // Update product
  updateProduct: async (
    id: string,
    updates: Partial<Product>
  ): Promise<Product> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error("Product not found");
      }

      return { ...product, ...updates, updated_at: new Date().toISOString() };
    }

    const response = await api.put<Product>(`/products/${id}`, updates);
    return response.data!;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.delete(`/products/${id}`);
  },

  // Purchase product
  purchaseProduct: async (
    productId: string,
    purchaseData: {
      quantity: number;
      selectedOptions?: Record<string, string>;
      shippingInfo: any;
      paymentInfo: any;
    }
  ): Promise<{ orderId: string; paymentUrl?: string }> => {
    if (shouldUseMockData()) {
      await mockDelay(1500);

      return {
        orderId: `ORDER-${Date.now()}`,
        paymentUrl: undefined, // No redirect needed for mock
      };
    }

    const response = await api.post<{ orderId: string; paymentUrl?: string }>(
      `/products/${productId}/purchase`,
      purchaseData
    );
    return response.data!;
  },

  // Verify product authenticity
  verifyProduct: async (
    verificationCode: string
  ): Promise<{
    valid: boolean;
    product?: Product;
    authorizationChain?: AuthorizationChain;
    ipAsset?: any;
    license?: any;
  }> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const authChain = findAuthorizationByCode(verificationCode);
      if (!authChain) {
        return { valid: false };
      }

      const product = mockProducts.find((p) => p.id === authChain.product_id);

      return {
        valid: true,
        product,
        authorizationChain: authChain,
        // In real implementation, would also return IP asset and license details
      };
    }

    const response = await api.get<{
      valid: boolean;
      product?: Product;
      authorizationChain?: AuthorizationChain;
      ipAsset?: any;
      license?: any;
    }>(`/products/verify/${verificationCode}`);
    return response.data!;
  },

  // Get authorization history for a product
  getAuthorizationHistory: async (
    productId: string
  ): Promise<AuthorizationChain[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return mockAuthorizationChain.filter(
        (chain) => chain.product_id === productId
      );
    }

    const response = await api.get<AuthorizationChain[]>(
      `/products/${productId}/authorization-history`
    );
    return response.data!;
  },

  // Get user's products
  getUserProducts: async (userId: string): Promise<Product[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return getProductsByCreator(userId);
    }

    const response = await api.get<Product[]>(`/users/${userId}/products`);
    return response.data!;
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 6): Promise<Product[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return mockProducts
        .sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0))
        .slice(0, limit);
    }

    const response = await api.get<Product[]>("/products/featured", { limit });
    return response.data!;
  },

  // Get related products
  getRelatedProducts: async (
    productId: string,
    limit: number = 4
  ): Promise<Product[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      const product = mockProducts.find((p) => p.id === productId);
      if (!product) return [];

      return mockProducts
        .filter((p) => p.id !== productId && p.category === product.category)
        .slice(0, limit);
    }

    const response = await api.get<Product[]>(
      `/products/${productId}/related`,
      { limit }
    );
    return response.data!;
  },

  // Search products
  searchProducts: async (
    query: string,
    filters?: FilterParams
  ): Promise<Product[]> => {
    if (shouldUseMockData()) {
      await mockDelay();

      return mockProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    const response = await api.get<Product[]>("/products/search", {
      q: query,
      ...filters,
    });
    return response.data!;
  },

  // Add product review
  addReview: async (
    productId: string,
    reviewData: {
      rating: number;
      comment: string;
    }
  ): Promise<void> => {
    if (shouldUseMockData()) {
      await mockDelay();
      return;
    }

    await api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Get product reviews
  getReviews: async (
    productId: string,
    pagination: PaginationParams = {}
  ): Promise<APIResponse<any[]>> => {
    if (shouldUseMockData()) {
      await mockDelay();

      // Mock reviews
      const mockReviews = [
        {
          id: "1",
          user_id: "3",
          rating: 5,
          comment: "Great quality product, exactly as described!",
          created_at: "2024-03-10T10:00:00Z",
        },
        {
          id: "2",
          user_id: "4",
          rating: 4,
          comment: "Good product, fast shipping.",
          created_at: "2024-03-08T15:30:00Z",
        },
      ];

      return {
        success: true,
        data: mockReviews,
        pagination: {
          page: 1,
          limit: 10,
          total: mockReviews.length,
          totalPages: 1,
        },
      };
    }

    const params = buildPaginationParams(pagination.page, pagination.limit);
    return await api.get<any[]>(`/products/${productId}/reviews`, params);
  },
};
