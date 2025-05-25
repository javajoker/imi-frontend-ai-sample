import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  Search,
  Star,
  Verified,
  ShoppingCart,
  Grid,
  List,
  DollarSign,
} from "lucide-react";
import { useQuery } from "react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { productService } from "../../services/productService";
import { Product } from "../../types";
import {
  findUserById,
  findIPAssetById,
  findLicenseApplicationById,
} from "../../data/mockData";
import { useCart } from "../../hooks/useCart";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import Button from "../../components/atoms/Button";

const MarketplacePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "created_at",
    sortOrder: searchParams.get("sortOrder") || "desc",
    price_min: searchParams.get("price_min")
      ? parseFloat(searchParams.get("price_min")!)
      : undefined,
    price_max: searchParams.get("price_max")
      ? parseFloat(searchParams.get("price_max")!)
      : undefined,
    status: "active",
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
  });

  // Fetch products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery(
    ["products", filters, pagination],
    () =>
      productService.getProducts(
        {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder as "asc" | "desc",
        },
        {
          category: filters.category,
          search: filters.search,
          price_min: filters.price_min,
          price_max: filters.price_max,
          status: filters.status,
        }
      ),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy !== "created_at") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);
    if (filters.price_min)
      params.set("price_min", filters.price_min.toString());
    if (filters.price_max)
      params.set("price_max", filters.price_max.toString());
    if (pagination.page !== 1) params.set("page", pagination.page.toString());

    setSearchParams(params);
  }, [filters, pagination.page, setSearchParams]);

  const handleFilterChange = (
    key: string,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "", label: t("marketplace.allCategories") },
    { value: "Apparel", label: t("marketplace.apparel") },
    { value: "Home Decor", label: t("marketplace.homeDecor") },
    { value: "Accessories", label: t("marketplace.accessories") },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: "Sort: Latest" },
    { value: "stats.rating:desc", label: t("marketplace.sortBestRated") },
    { value: "price:asc", label: t("marketplace.sortPriceLowHigh") },
    { value: "price:desc", label: t("marketplace.sortPriceHighLow") },
    { value: "stats.purchases:desc", label: "Sort: Best Selling" },
  ];

  if (error) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <p className="text-error-600">
            Failed to load products. Please try again.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-heading-2 mb-2">{t("marketplace.title")}</h1>
              <p className="text-gray-600">
                Shop verified authentic products created with licensed IP
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="border border-gray-300 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(":");
                  setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Advanced Filters Toggle */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Min Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.price_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "price_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="form-label">Max Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.price_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "price_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="form-input"
                    placeholder="1000.00"
                  />
                </div>

                <div>
                  <label className="form-label">Availability</label>
                  <select className="form-input">
                    <option value="">All Products</option>
                    <option value="in_stock">In Stock Only</option>
                    <option value="low_stock">Low Stock</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Rating</label>
                  <select className="form-input">
                    <option value="">All Ratings</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-responsive py-8">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {products?.pagination && (
              <>
                Showing{" "}
                {(products.pagination.page - 1) * products.pagination.limit + 1}
                -
                {Math.min(
                  products.pagination.page * products.pagination.limit,
                  products.pagination.total
                )}{" "}
                of {products.pagination.total} results
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading products..." />
          </div>
        )}

        {/* Products Grid/List */}
        {!isLoading && products?.data && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.data.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.data.map((product: Product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.pagination && products.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={products.pagination.page === 1}
                    onClick={() =>
                      handlePageChange((products.pagination?.page ?? 1) - 1)
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: Math.min(5, products.pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            page === (products.pagination?.page ?? 1)
                              ? "primary"
                              : "secondary"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={
                      products.pagination.page ===
                      products.pagination.totalPages
                    }
                    onClick={() =>
                      handlePageChange((products.pagination?.page ?? 1) + 1)
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && products?.data && products.data.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setFilters({
                  category: "",
                  search: "",
                  sortBy: "created_at",
                  sortOrder: "desc",
                  price_min: undefined,
                  price_max: undefined,
                  status: "active",
                });
                setPagination({ page: 1, limit: 12 });
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const seller = findUserById(product.creator_id);
  const license = findLicenseApplicationById(product.license_id);
  const ipAsset = license ? findIPAssetById(license.ip_asset_id) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="card card-hover overflow-hidden group">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.authenticity_verified && (
            <div className="absolute top-2 right-2 bg-success-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <Verified className="w-3 h-3" />
              <span>{t("marketplace.verified")}</span>
            </div>
          )}
          {product.inventory_count < 10 && product.inventory_count > 0 && (
            <div className="absolute top-2 left-2 bg-warning-500 text-white px-2 py-1 rounded-full text-xs">
              Only {product.inventory_count} left
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 truncate hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 truncate-2">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center space-x-2 mb-3">
          {seller && (
            <>
              <img
                src={seller.profile_data.avatar}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600 truncate">
                {seller.profile_data.display_name}
              </span>
              {product.stats?.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">
                    {product.stats.rating}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {ipAsset && (
          <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 mb-3">
            <Link
              to={`/ip/${ipAsset.id}`}
              className="text-xs text-blue-800 hover:text-blue-900"
            >
              {t("marketplace.licensedFrom")}: {ipAsset.title}
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-success-600">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">
            {product.inventory_count} {t("marketplace.inStock")}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button variant="secondary" size="sm" fullWidth>
              {t("marketplace.viewDetails")}
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            disabled={product.inventory_count === 0}
          >
            {t("marketplace.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Product List Item Component
const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const seller = findUserById(product.creator_id);
  const license = findLicenseApplicationById(product.license_id);
  const ipAsset = license ? findIPAssetById(license.ip_asset_id) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="card card-hover p-6 flex items-center space-x-6 group">
      <Link to={`/products/${product.id}`} className="w-32 h-32 flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.id}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold truncate pr-4 hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {product.authenticity_verified && (
                <div className="flex items-center space-x-1 text-success-600">
                  <Verified className="w-4 h-4" />
                  <span className="text-xs">{t("marketplace.verified")}</span>
                </div>
              )}
              <span className="text-xl font-bold text-success-600">
                ${product.price}
              </span>
            </div>
          </div>
        </Link>

        <p className="text-gray-600 mb-3 truncate-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {seller && (
              <div className="flex items-center space-x-2">
                <img
                  src={seller.profile_data.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">
                  {seller.profile_data.display_name}
                </span>
              </div>
            )}
            <span className="badge badge-primary">{product.category}</span>
            {ipAsset && (
              <Link
                to={`/ip/${ipAsset.id}`}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Licensed IP
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {product.inventory_count} in stock
            </div>
            <div className="flex space-x-2">
              <Link to={`/products/${product.id}`}>
                <Button variant="secondary" size="sm">
                  {t("marketplace.viewDetails")}
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                disabled={product.inventory_count === 0}
              >
                {t("marketplace.addToCart")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
