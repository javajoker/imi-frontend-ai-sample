import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Upload,
  Plus,
  TrendingUp,
  BarChart3,
  FileText,
  Package,
  Check,
  X,
  Eye,
  DollarSign,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { ipService } from "../../services/ipService";
import { productService } from "../../services/productService";
import { IPRegistrationForm, ProductCreationForm } from "../../types";
import {
  getLicenseApplicationsForCreator,
  getLicenseApplicationsByApplicant,
  getTransactionsByUser,
} from "../../data/mockData";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import toast from "react-hot-toast";

const CreateContentPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const defaultTab =
    searchParams.get("tab") ||
    (user?.user_type === "creator" ? "register-ip" : "create-product");
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!user) return <LoadingSpinner fullScreen />;

  const tabs = [
    {
      id: "register-ip",
      label: t("create.registerIP"),
      show: user.user_type === "creator",
      icon: Package,
    },
    {
      id: "create-product",
      label: t("create.createProduct"),
      show: user.user_type === "secondary_creator",
      icon: Plus,
    },
    {
      id: "manage-licenses",
      label: t("create.licenseManagement"),
      show: true,
      icon: FileText,
    },
    {
      id: "analytics",
      label: t("create.revenueAnalytics"),
      show: true,
      icon: BarChart3,
    },
  ].filter((tab) => tab.show);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <h1 className="text-heading-2 mb-2">{t("create.title")}</h1>
          <p className="text-gray-600">
            Manage your intellectual property and products
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-responsive py-8">
        {activeTab === "register-ip" && user.user_type === "creator" && (
          <RegisterIPTab />
        )}
        {activeTab === "create-product" &&
          user.user_type === "secondary_creator" && <CreateProductTab />}
        {activeTab === "manage-licenses" && <ManageLicensesTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

// Register IP Tab Component
const RegisterIPTab: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPRegistrationForm>();

  const createIPMutation = useMutation(ipService.createIPAsset, {
    onSuccess: () => {
      toast.success(t("messages.success.ipRegistered"));
      reset();
      setFiles([]);
      queryClient.invalidateQueries("user-ips");
    },
    onError: (error: any) => {
      toast.error(error.message || t("messages.error.generic"));
    },
  });

  const onSubmit = (data: IPRegistrationForm) => {
    createIPMutation.mutate({
      ...data,
      files,
      tags: data.tags
        ? String(data.tags)
            .split(",")
            .map((tag) => tag.trim())
        : [],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg p-6 shadow-card">
        <h2 className="text-xl font-bold mb-6">{t("create.registerNewIP")}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="form-label">{t("create.ipTitle")} *</label>
            <input
              type="text"
              className={`form-input ${errors.title ? "border-error-500" : ""}`}
              placeholder={t("create.ipTitlePlaceholder")}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">{t("create.ipDescription")} *</label>
            <textarea
              className={`form-input ${
                errors.description ? "border-error-500" : ""
              }`}
              rows={4}
              placeholder={t("create.ipDescriptionPlaceholder")}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Content Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t("common.category")} *</label>
              <select
                className={`form-input ${
                  errors.category ? "border-error-500" : ""
                }`}
                {...register("category", { required: "Category is required" })}
              >
                <option value="">{t("create.selectCategory")}</option>
                <option value="Digital Art">{t("ipBrowse.digitalArt")}</option>
                <option value="Pattern Design">
                  {t("ipBrowse.patternDesign")}
                </option>
                <option value="Photography">{t("ipBrowse.photography")}</option>
                <option value="Illustrations">
                  {t("ipBrowse.illustrations")}
                </option>
              </select>
              {errors.category && (
                <p className="form-error">{errors.category.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">{t("common.type")} *</label>
              <select
                className={`form-input ${
                  errors.content_type ? "border-error-500" : ""
                }`}
                {...register("content_type", {
                  required: "Content type is required",
                })}
              >
                <option value="">{t("create.selectType")}</option>
                <option value="image">Image</option>
                <option value="vector">Vector</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
              {errors.content_type && (
                <p className="form-error">{errors.content_type.message}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="form-label">{t("create.uploadFiles")} *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">
                {t("create.uploadPlaceholder")}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {t("create.fileTypes")}
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.svg"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="secondary" size="sm" as="span">
                  Choose Files
                </Button>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {files.length} file(s) selected:
                </p>
                <ul className="text-xs text-gray-500 mt-1">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">{t("create.tags")}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t("create.tagsPlaceholder")}
              {...register("tags")}
            />
          </div>

          {/* License Terms */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">{t("create.licenseTerms")}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  {t("create.baseLicenseFee")}
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="50"
                  {...register("license_terms.base_fee", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label className="form-label">{t("create.revenueShare")}</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="15"
                  min="5"
                  max="50"
                  {...register("license_terms.revenue_share_percentage", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">
                {t("create.licenseRequirements")}
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={t("create.requirementsPlaceholder")}
                {...register("license_terms.requirements")}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary">
              {t("create.saveDraft")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createIPMutation.isLoading}
            >
              {t("create.registerIPButton")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Product Tab Component
const CreateProductTab: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductCreationForm>();

  // Get user's approved license applications
  const { data: approvedLicenses, isLoading: licensesLoading } = useQuery(
    ["user-approved-licenses", user?.id],
    () =>
      getLicenseApplicationsByApplicant(user!.id).filter(
        (app) => app.status === "approved"
      ),
    { enabled: !!user }
  );

  const createProductMutation = useMutation(productService.createProduct, {
    onSuccess: () => {
      toast.success(t("messages.success.productCreated"));
      reset();
      setImages([]);
      queryClient.invalidateQueries("user-products");
    },
    onError: (error: any) => {
      toast.error(error.message || t("messages.error.generic"));
    },
  });

  const onSubmit = (data: ProductCreationForm) => {
    createProductMutation.mutate({
      ...data,
      images,
      specifications: {
        material: (data.specifications as any).material || "",
        sizes: (data.specifications as any).sizes
          ? String((data.specifications as any).sizes)
              .split(",")
              .map((s: string) => s.trim())
          : [],
        colors: (data.specifications as any).colors
          ? String((data.specifications as any).colors)
              .split(",")
              .map((c: string) => c.trim())
          : [],
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  if (licensesLoading) return <LoadingSpinner />;

  if (!approvedLicenses || approvedLicenses.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg p-6 shadow-card text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Licensed IP Available
          </h3>
          <p className="text-gray-600 mb-6">
            You need to have approved license applications before you can create
            products.
          </p>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/browse-ip")}
          >
            Browse IP to License
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg p-6 shadow-card">
        <h2 className="text-xl font-bold mb-6">
          {t("create.createNewProduct")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Licensed IP Selection */}
          <div>
            <label className="form-label">
              {t("create.licensedIPAsset")} *
            </label>
            <select
              className={`form-input ${
                errors.license_id ? "border-error-500" : ""
              }`}
              {...register("license_id", {
                required: "Please select a licensed IP",
              })}
            >
              <option value="">{t("create.selectLicensedIP")}</option>
              {approvedLicenses.map((license) => (
                <option key={license.id} value={license.id}>
                  License #{license.id} - IP Asset #{license.ip_asset_id}
                </option>
              ))}
            </select>
            {errors.license_id && (
              <p className="form-error">{errors.license_id.message}</p>
            )}
          </div>

          {/* Product Title */}
          <div>
            <label className="form-label">{t("create.productTitle")} *</label>
            <input
              type="text"
              className={`form-input ${errors.title ? "border-error-500" : ""}`}
              placeholder={t("create.productTitlePlaceholder")}
              {...register("title", { required: "Product title is required" })}
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">
              {t("create.productDescription")} *
            </label>
            <textarea
              className={`form-input ${
                errors.description ? "border-error-500" : ""
              }`}
              rows={4}
              placeholder={t("create.productDescriptionPlaceholder")}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Category, Price, Inventory */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">{t("common.category")} *</label>
              <select
                className={`form-input ${
                  errors.category ? "border-error-500" : ""
                }`}
                {...register("category", { required: "Category is required" })}
              >
                <option value="">{t("create.selectCategory")}</option>
                <option value="Apparel">{t("marketplace.apparel")}</option>
                <option value="Home Decor">{t("marketplace.homeDecor")}</option>
                <option value="Accessories">
                  {t("marketplace.accessories")}
                </option>
              </select>
              {errors.category && (
                <p className="form-error">{errors.category.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">{t("common.price")} ($) *</label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${
                  errors.price ? "border-error-500" : ""
                }`}
                placeholder="29.99"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
              />
              {errors.price && (
                <p className="form-error">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Inventory *</label>
              <input
                type="number"
                className={`form-input ${
                  errors.inventory_count ? "border-error-500" : ""
                }`}
                placeholder="50"
                {...register("inventory_count", {
                  required: "Inventory is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Inventory must be at least 1" },
                })}
              />
              {errors.inventory_count && (
                <p className="form-error">{errors.inventory_count.message}</p>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="form-label">{t("create.productImages")} *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">
                {t("create.productImagesPlaceholder")}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {t("create.productImageTypes")}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="secondary" size="sm" as="span">
                  Choose Images
                </Button>
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {images.length} image(s) selected
                </p>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="form-label">{t("create.specifications")}</label>
            <div className="space-y-3">
              <input
                type="text"
                className="form-input"
                placeholder={t("create.specPlaceholder1")}
                {...register("specifications.material" as any)}
              />
              <input
                type="text"
                className="form-input"
                placeholder={t("create.specPlaceholder2")}
                {...register("specifications.sizes" as any)}
              />
              <input
                type="text"
                className="form-input"
                placeholder={t("create.specPlaceholder3")}
                {...register("specifications.colors" as any)}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary">
              {t("create.saveDraft")}
            </Button>
            <Button
              type="submit"
              variant="success"
              isLoading={createProductMutation.isLoading}
            >
              {t("create.createProductButton")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Manage Licenses Tab Component
const ManageLicensesTab: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const approveLicenseMutation = useMutation(
    ipService.approveLicenseApplication,
    {
      onSuccess: () => {
        toast.success(t("messages.success.licenseApproved"));
      },
      onError: (error: any) => {
        toast.error(error.message || t("messages.error.generic"));
      },
    }
  );

  const rejectLicenseMutation = useMutation(
    ipService.rejectLicenseApplication,
    {
      onSuccess: () => {
        toast.success(t("messages.success.licenseRejected"));
      },
      onError: (error: any) => {
        toast.error(error.message || t("messages.error.generic"));
      },
    }
  );

  return (
    <div className="space-y-8">
      {/* Incoming Applications (for creators) */}
      {user?.user_type === "creator" && (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="font-medium">{t("create.incomingApplications")}</h3>
          </div>
          <div className="divide-y">
            {getLicenseApplicationsForCreator(user.id).map((app) => (
              <div key={app.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium mb-2">
                      Application #{app.id}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {app.application_data.intended_use}
                    </p>
                    <div className="text-xs text-gray-500">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        app.status === "approved"
                          ? "bg-success-100 text-success-800"
                          : app.status === "rejected"
                          ? "bg-error-100 text-error-800"
                          : "bg-warning-100 text-warning-800"
                      }`}
                    >
                      {t(`status.${app.status}`)}
                    </span>
                    {app.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => approveLicenseMutation.mutate(app.id)}
                          isLoading={approveLicenseMutation.isLoading}
                        >
                          {t("create.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            rejectLicenseMutation.mutate({
                              applicationId: app.id,
                              reason: "Requirements not met",
                            })
                          }
                          isLoading={rejectLicenseMutation.isLoading}
                        >
                          {t("create.reject")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Applications (for secondary creators) */}
      {user?.user_type === "secondary_creator" && (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="font-medium">{t("create.myApplications")}</h3>
          </div>
          <div className="divide-y">
            {getLicenseApplicationsByApplicant(user.id).map((app) => (
              <div key={app.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      Application #{app.id}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      IP Asset #{app.ip_asset_id}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {app.application_data.intended_use}
                    </p>
                    <div className="text-xs text-gray-500">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      app.status === "approved"
                        ? "bg-success-100 text-success-800"
                        : app.status === "rejected"
                        ? "bg-error-100 text-error-800"
                        : "bg-warning-100 text-warning-800"
                    }`}
                  >
                    {t(`status.${app.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const revenueStats = [
    {
      label: t("create.totalRevenue"),
      value: `$${user?.profile_data.total_revenue || 0}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: t("create.thisMonth"),
      value: `$${Math.round((user?.profile_data.total_revenue || 0) * 0.3)}`,
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: t("create.availableBalance"),
      value: `$${Math.round((user?.profile_data.total_revenue || 0) * 0.85)}`,
      icon: DollarSign,
      color: "purple",
    },
    {
      label: t("create.avgRevenueShare"),
      value: user?.user_type === "creator" ? "15%" : "8%",
      icon: BarChart3,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-medium mb-4">
          {t("create.revenueTrends")}
        </h3>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>{t("create.revenueChart")}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-card">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="font-medium">{t("create.recentTransactions")}</h3>
        </div>
        <div className="divide-y">
          {getTransactionsByUser(user!.id)
            .slice(0, 5)
            .map((tx) => (
              <div key={tx.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Transaction #{tx.id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-success-600">
                      +$
                      {tx.revenue_shares?.ip_creator ||
                        tx.revenue_shares?.seller ||
                        tx.amount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tx.transaction_type.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CreateContentPage;
