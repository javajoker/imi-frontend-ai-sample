import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Verified,
  Globe,
  Star,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { ipService } from "../../services/ipService";
import { findUserById, mockLicenseTerms } from "../../data/mockData";
import { LicenseApplicationForm } from "../../types";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import toast from "react-hot-toast";

const IPDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedLicenseType, setSelectedLicenseType] = useState("standard");
  const [showLicenseApplication, setShowLicenseApplication] = useState(false);
  const [applicationForm, setApplicationForm] =
    useState<LicenseApplicationForm>({
      intended_use: "",
      portfolio_links: [""],
      business_description: "",
    });

  // Fetch IP asset details
  const {
    data: ipAsset,
    isLoading,
    error,
  } = useQuery(["ip-asset", id], () => ipService.getIPAsset(id!), {
    enabled: !!id,
  });

  // Fetch license terms
  const { data: licenseTerms } = useQuery(
    ["license-terms", id],
    () => ipService.getLicenseTerms(id!),
    { enabled: !!id }
  );

  // Apply for license mutation
  const applyForLicenseMutation = useMutation(
    (data: {
      ipAssetId: string;
      licenseTermsId: string;
      applicationData: LicenseApplicationForm;
    }) =>
      ipService.applyForLicense(
        data.ipAssetId,
        data.licenseTermsId,
        data.applicationData
      ),
    {
      onSuccess: () => {
        toast.success(t("messages.success.licenseApplied"));
        setShowLicenseApplication(false);
        queryClient.invalidateQueries(["license-applications"]);
      },
      onError: (error) => {
        toast.error("Failed to submit license application");
      },
    }
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !ipAsset) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            IP Asset Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The IP asset you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/browse-ip">
            <Button variant="primary">Browse IP Assets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const creator = findUserById(ipAsset.creator_id);
  const availableLicenseTerms =
    licenseTerms ||
    mockLicenseTerms.filter((term) => term.ip_asset_id === ipAsset.id);
  const selectedTerms = availableLicenseTerms.find(
    (term) => term.license_type === selectedLicenseType
  );

  const handleLicenseApplicationSubmit = () => {
    if (!selectedTerms) return;

    applyForLicenseMutation.mutate({
      ipAssetId: ipAsset.id,
      licenseTermsId: selectedTerms.id,
      applicationData: applicationForm,
    });
  };

  const addPortfolioLink = () => {
    setApplicationForm((prev) => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, ""],
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setApplicationForm((prev) => ({
      ...prev,
      portfolio_links: prev.portfolio_links.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  const removePortfolioLink = (index: number) => {
    setApplicationForm((prev) => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              to="/browse-ip"
              className="hover:text-primary-600 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("ipDetail.breadcrumb")}</span>
            </Link>
            <span>/</span>
            <span>{ipAsset.category}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {ipAsset.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery - 60% */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-card">
              <div className="aspect-video relative bg-gray-100 rounded overflow-hidden">
                <img
                  src={
                    ipAsset.file_urls[selectedImageIndex] ||
                    ipAsset.file_urls[0]
                  }
                  alt={ipAsset.title}
                  className="w-full h-full object-contain"
                />

                {/* Image Navigation */}
                {ipAsset.file_urls.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          Math.max(0, selectedImageIndex - 1)
                        )
                      }
                      disabled={selectedImageIndex === 0}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          Math.min(
                            ipAsset.file_urls.length - 1,
                            selectedImageIndex + 1
                          )
                        )
                      }
                      disabled={
                        selectedImageIndex === ipAsset.file_urls.length - 1
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {ipAsset.file_urls.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {ipAsset.file_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        index === selectedImageIndex
                          ? "border-primary-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-bold mb-4">
                {t("ipDetail.description")}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {ipAsset.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">
                    {t("common.category")}:
                  </strong>{" "}
                  {ipAsset.category}
                </div>
                <div>
                  <strong className="text-gray-900">
                    {t("ipDetail.contentType")}:
                  </strong>{" "}
                  {ipAsset.content_type}
                </div>
                {ipAsset.metadata?.dimensions && (
                  <div>
                    <strong className="text-gray-900">
                      {t("ipDetail.dimensions")}:
                    </strong>{" "}
                    {ipAsset.metadata.dimensions}
                  </div>
                )}
                {ipAsset.metadata?.file_size && (
                  <div>
                    <strong className="text-gray-900">
                      {t("ipDetail.fileSize")}:
                    </strong>{" "}
                    {ipAsset.metadata.file_size}
                  </div>
                )}
              </div>

              {/* Tags */}
              {ipAsset.metadata?.tags && ipAsset.metadata.tags.length > 0 && (
                <div className="mt-6">
                  <strong className="text-sm text-gray-900 mb-2 block">
                    {t("ipDetail.tags")}:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {ipAsset.metadata.tags.map((tag: string) => (
                      <span key={tag} className="badge badge-gray">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel - 40% */}
          <div className="space-y-6">
            {/* Title & Creator */}
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h1 className="text-2xl font-bold mb-4">{ipAsset.title}</h1>

              {creator && (
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={creator.profile_data.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {creator.profile_data.display_name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{creator.profile_data.rating}</span>
                      <span>
                        • {creator.profile_data.portfolio_count} assets
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {ipAsset.verification_status === "approved" && (
                  <div className="flex items-center space-x-1 bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm">
                    <Verified className="w-4 h-4" />
                    <span>{t("ipDetail.verifiedIP")}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Globe className="w-4 h-4" />
                  <span>{t("ipDetail.globalLicense")}</span>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 text-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {ipAsset.stats?.views || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("ipDetail.activeViews")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success-600">
                    {ipAsset.stats?.active_licenses || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("ipDetail.activeLicenses")}
                  </div>
                </div>
              </div>
            </div>

            {/* Licensing Terms */}
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-bold mb-4">
                {t("ipDetail.availableLicenses")}
              </h3>

              {availableLicenseTerms.map((term) => (
                <div
                  key={term.id}
                  className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
                    selectedLicenseType === term.license_type
                      ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedLicenseType(term.license_type)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium capitalize">
                      {t(`ipDetail.${term.license_type}License`)}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success-600">
                        ${term.base_fee}
                      </div>
                      <div className="text-xs text-gray-500">
                        + {term.revenue_share_percentage}% revenue
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <strong>{t("ipDetail.territory")}:</strong>{" "}
                      {term.territory}
                    </div>
                    <div>
                      <strong>{t("ipDetail.duration")}:</strong> {term.duration}
                    </div>
                  </div>

                  {term.requirements && (
                    <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                      <strong>Requirements:</strong> {term.requirements}
                    </div>
                  )}
                </div>
              ))}

              {/* Apply Button */}
              {user?.user_type === "secondary_creator" &&
                user.id !== ipAsset.creator_id && (
                  <Button
                    variant="success"
                    size="lg"
                    fullWidth
                    onClick={() => setShowLicenseApplication(true)}
                    leftIcon={<FileText className="w-5 h-5" />}
                  >
                    {t("ipDetail.applyForLicense")}
                  </Button>
                )}

              {user?.id === ipAsset.creator_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-800 text-sm">This is your IP asset</p>
                </div>
              )}

              {!user && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Sign in to apply for license
                  </p>
                  <Button variant="primary" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-bold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Created: {new Date(ipAsset.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {ipAsset.stats?.views || 0} views
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {ipAsset.stats?.license_applications || 0} applications
                  </span>
                </div>
                {ipAsset.blockchain_hash && (
                  <div className="flex items-start space-x-2">
                    <Verified className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-gray-600">Blockchain verified</div>
                      <div className="text-xs text-gray-500 font-mono break-all">
                        {ipAsset.blockchain_hash}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* License Application Modal */}
      {showLicenseApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {t("ipDetail.licenseApplication")}
                </h2>
                <button
                  onClick={() => setShowLicenseApplication(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Selected License Info */}
                {selectedTerms && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h3 className="font-medium text-primary-900 mb-2 capitalize">
                      {selectedTerms.license_type} License
                    </h3>
                    <div className="text-sm text-primary-800 space-y-1">
                      <div>
                        <strong>Fee:</strong> ${selectedTerms.base_fee} +{" "}
                        {selectedTerms.revenue_share_percentage}% revenue share
                      </div>
                      <div>
                        <strong>Territory:</strong> {selectedTerms.territory}
                      </div>
                      <div>
                        <strong>Duration:</strong> {selectedTerms.duration}
                      </div>
                    </div>
                  </div>
                )}

                {/* Application Form */}
                <div>
                  <label className="form-label">
                    {t("ipDetail.intendedUse")} *
                  </label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder={t("ipDetail.intendedUsePlaceholder")}
                    value={applicationForm.intended_use}
                    onChange={(e) =>
                      setApplicationForm((prev) => ({
                        ...prev,
                        intended_use: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="form-label">
                    {t("ipDetail.portfolioLinks")}
                  </label>
                  {applicationForm.portfolio_links.map((link, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="url"
                        className="form-input flex-1"
                        placeholder={t("ipDetail.portfolioPlaceholder")}
                        value={link}
                        onChange={(e) =>
                          updatePortfolioLink(index, e.target.value)
                        }
                      />
                      {applicationForm.portfolio_links.length > 1 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => removePortfolioLink(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addPortfolioLink}>
                    + Add Another Link
                  </Button>
                </div>

                <div>
                  <label className="form-label">
                    {t("ipDetail.businessDescription")}
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder={t("ipDetail.businessPlaceholder")}
                    value={applicationForm.business_description}
                    onChange={(e) =>
                      setApplicationForm((prev) => ({
                        ...prev,
                        business_description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Requirements */}
                {selectedTerms?.requirements && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      {t("ipDetail.licenseRequirements")}:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedTerms.requirements}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setShowLicenseApplication(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="success"
                  onClick={handleLicenseApplicationSubmit}
                  isLoading={applyForLicenseMutation.isLoading}
                  disabled={!applicationForm.intended_use.trim()}
                >
                  {t("ipDetail.submitApplication")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPDetailPage;
