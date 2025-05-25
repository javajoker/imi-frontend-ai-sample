import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  Search,
  Star,
  Verified,
  Eye,
  FileText,
  Grid,
  List,
} from "lucide-react";
import { useQuery } from "react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { ipService } from "../../services/ipService";
import { IPAsset } from "../../types";
import { findUserById } from "../../data/mockData";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import Button from "../../components/atoms/Button";

const BrowseIPPage: React.FC = () => {
  const { t } = useLanguage();
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
    status: "active",
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
  });

  // Fetch IP assets
  const {
    data: ipAssets,
    isLoading,
    error,
  } = useQuery(
    ["ip-assets", filters, pagination],
    () =>
      ipService.getIPAssets(
        {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder as "asc" | "desc",
        },
        {
          category: filters.category,
          search: filters.search,
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
    if (pagination.page !== 1) params.set("page", pagination.page.toString());

    setSearchParams(params);
  }, [filters, pagination.page, setSearchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "", label: t("ipBrowse.allCategories") },
    { value: "Digital Art", label: t("ipBrowse.digitalArt") },
    { value: "Pattern Design", label: t("ipBrowse.patternDesign") },
    { value: "Photography", label: t("ipBrowse.photography") },
    { value: "Illustrations", label: t("ipBrowse.illustrations") },
  ];

  const sortOptions = [
    { value: "created_at:desc", label: t("ipBrowse.sortLatest") },
    { value: "stats.views:desc", label: t("ipBrowse.sortPopular") },
    { value: "title:asc", label: "Sort: A-Z" },
    { value: "title:desc", label: "Sort: Z-A" },
  ];

  if (error) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <p className="text-error-600">
            Failed to load IP assets. Please try again.
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
              <h1 className="text-heading-2 mb-2">{t("ipBrowse.title")}</h1>
              <p className="text-gray-600">
                Discover and license original intellectual property from
                verified creators
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
                  placeholder="Search IP assets..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Verification Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="">All</option>
                    <option value="approved">Verified Only</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Content Type</label>
                  <select className="form-input">
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="vector">Vectors</option>
                    <option value="video">Videos</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">License Type</label>
                  <select className="form-input">
                    <option value="">All Licenses</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="exclusive">Exclusive</option>
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
            {ipAssets?.pagination && (
              <>
                Showing{" "}
                {(ipAssets.pagination.page - 1) * ipAssets.pagination.limit + 1}
                -
                {Math.min(
                  ipAssets.pagination.page * ipAssets.pagination.limit,
                  ipAssets.pagination.total
                )}{" "}
                of {ipAssets.pagination.total} results
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading IP assets..." />
          </div>
        )}

        {/* IP Assets Grid/List */}
        {!isLoading && ipAssets?.data && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ipAssets.data.map((ip: IPAsset) => (
                  <IPAssetCard key={ip.id} ipAsset={ip} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {ipAssets.data.map((ip: IPAsset) => (
                  <IPAssetListItem key={ip.id} ipAsset={ip} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {ipAssets.pagination && ipAssets.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={ipAssets.pagination.page === 1}
                    onClick={() =>
                      handlePageChange((ipAssets.pagination?.page ?? 1) - 1)
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: Math.min(5, ipAssets.pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            page === (ipAssets.pagination?.page ?? 1)
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
                      ipAssets.pagination.page ===
                      ipAssets.pagination.totalPages
                    }
                    onClick={() =>
                      handlePageChange((ipAssets.pagination?.page ?? 1) + 1)
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
        {!isLoading && ipAssets?.data && ipAssets.data.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No IP assets found
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

// IP Asset Card Component
const IPAssetCard: React.FC<{ ipAsset: IPAsset }> = ({ ipAsset }) => {
  const creator = findUserById(ipAsset.creator_id);

  return (
    <Link
      to={`/ip/${ipAsset.id}`}
      className="card card-hover overflow-hidden group"
    >
      <div className="aspect-video relative">
        <img
          src={ipAsset.file_urls[0]}
          alt={ipAsset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {ipAsset.verification_status === "approved" && (
          <div className="absolute top-2 right-2 bg-success-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <Verified className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-2 truncate">{ipAsset.title}</h3>
        <p className="text-gray-600 text-sm mb-3 truncate-2">
          {ipAsset.description}
        </p>

        <div className="flex items-center space-x-2 mb-3">
          {creator && (
            <>
              <img
                src={creator.profile_data.avatar}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600 truncate">
                {creator.profile_data.display_name}
              </span>
              {creator.profile_data.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">
                    {creator.profile_data.rating}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="badge badge-primary">{ipAsset.category}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{ipAsset.stats?.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{ipAsset.stats?.license_applications || 0}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Button variant="primary" size="sm" fullWidth>
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
};

// IP Asset List Item Component
const IPAssetListItem: React.FC<{ ipAsset: IPAsset }> = ({ ipAsset }) => {
  const creator = findUserById(ipAsset.creator_id);

  return (
    <Link
      to={`/ip/${ipAsset.id}`}
      className="card card-hover p-6 flex items-center space-x-6 group"
    >
      <div className="w-32 h-24 flex-shrink-0">
        <img
          src={ipAsset.file_urls[0]}
          alt={ipAsset.title}
          className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold truncate pr-4">
            {ipAsset.title}
          </h3>
          {ipAsset.verification_status === "approved" && (
            <div className="flex items-center space-x-1 text-success-600">
              <Verified className="w-4 h-4" />
              <span className="text-xs">Verified</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-3 truncate-2">{ipAsset.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {creator && (
              <div className="flex items-center space-x-2">
                <img
                  src={creator.profile_data.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">
                  {creator.profile_data.display_name}
                </span>
              </div>
            )}
            <span className="badge badge-primary">{ipAsset.category}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{ipAsset.stats?.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{ipAsset.stats?.license_applications || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BrowseIPPage;
