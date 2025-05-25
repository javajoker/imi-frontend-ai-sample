import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Scan,
  Search,
  Check,
  X,
  Shield,
  Link as LinkIcon,
  Calendar,
  User,
  Package,
  FileText,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { productService } from "../../services/productService";
import {
  findUserById,
  findIPAssetById,
  findLicenseApplicationById,
  mockAuthorizationChain,
} from "../../data/mockData";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";

const VerificationPage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const { t } = useLanguage();
  const [verificationCode, setVerificationCode] = useState(code || "");
  const [isScanning, setIsScanning] = useState(false);

  // Auto-verify if code is provided in URL
  const {
    data: verificationResult,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["product-verification", verificationCode],
    () => productService.verifyProduct(verificationCode),
    {
      enabled: !!verificationCode,
      retry: false,
    }
  );

  const handleVerification = () => {
    if (verificationCode.trim()) {
      refetch();
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false);
      // In a real app, this would use camera API
      alert(
        "QR code scanning would use device camera. For demo, please enter a verification code manually."
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <h1 className="text-heading-2 mb-2">{t("verify.title")}</h1>
          <p className="text-gray-600">
            Verify the authenticity of products using blockchain-secured
            authorization chains
          </p>
        </div>
      </div>

      <div className="container-responsive py-8">
        {/* Verification Input */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-card mb-8">
            <h2 className="text-lg font-medium mb-6">
              {t("verify.verifyAuthenticity")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Scanner */}
              <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center">
                  {isScanning ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <Scan className="w-12 h-12 text-gray-400 mb-3" />
                  )}
                  <h3 className="font-medium mb-2">{t("verify.scanQRCode")}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("verify.scanDescription")}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleScan}
                    isLoading={isScanning}
                    disabled={isScanning}
                  >
                    {t("verify.openCamera")}
                  </Button>
                </div>
              </div>

              {/* Manual Code Entry */}
              <div>
                <h3 className="font-medium mb-3">{t("verify.enterCode")}</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t("verify.codePlaceholder")}
                    className="form-input"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleVerification()
                    }
                  />
                  <Button
                    variant="success"
                    fullWidth
                    onClick={handleVerification}
                    isLoading={isLoading}
                    disabled={!verificationCode.trim()}
                  >
                    {t("verify.verifyProduct")}
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2">{t("verify.tryDemoCodes")}</p>
                  <div className="space-y-1">
                    {[
                      "VER-MT-001-2024",
                      "VER-MT-002-2024",
                      "VER-MT-003-2024",
                    ].map((demoCode) => (
                      <button
                        key={demoCode}
                        onClick={() => setVerificationCode(demoCode)}
                        className="text-primary-600 hover:text-primary-800 block hover:underline"
                      >
                        {demoCode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="Verifying product..." />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg p-6 shadow-card mb-8">
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-error-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-error-600 mb-2">
                  Verification Failed
                </h3>
                <p className="text-gray-600">
                  There was an error verifying the product. Please try again or
                  contact support.
                </p>
              </div>
            </div>
          )}

          {/* Verification Results */}
          {verificationResult && (
            <div className="bg-white rounded-lg p-6 shadow-card mb-8">
              <h2 className="text-lg font-medium mb-6">
                {t("verify.verificationResults")}
              </h2>

              {verificationResult.valid ? (
                <VerificationSuccess result={verificationResult} />
              ) : (
                <VerificationFailure />
              )}
            </div>
          )}

          {/* Recent Verifications */}
          <RecentVerifications />
        </div>
      </div>
    </div>
  );
};

// Verification Success Component
const VerificationSuccess: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useLanguage();
  const authChain = result.authorizationChain;
  const product = result.product;
  const ipAsset = findIPAssetById(authChain?.ip_asset_id);
  const license = findLicenseApplicationById(authChain?.license_id);
  const seller = findUserById(product?.creator_id);
  const ipCreator = findUserById(ipAsset?.creator_id ?? "-1");

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="flex items-center space-x-3 text-success-600 mb-6">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {t("verify.productAuthentic")}
          </h3>
          <p className="text-gray-600">
            Verified through blockchain authorization chain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Information */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary-600" />
            <span>{t("verify.productInformation")}</span>
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div>
              <strong>{t("verify.product")}:</strong> {product?.title}
            </div>
            <div>
              <strong>{t("verify.seller")}:</strong>{" "}
              {seller?.profile_data.display_name}
            </div>
            <div>
              <strong>{t("common.price")}:</strong> ${product?.price}
            </div>
            <div>
              <strong>{t("common.category")}:</strong> {product?.category}
            </div>
            {product?.authenticity_verified && (
              <div className="flex items-center space-x-2 text-success-600">
                <Shield className="w-4 h-4" />
                <span>Authenticity Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* IP Authorization */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <span>{t("verify.ipAuthorization")}</span>
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div>
              <strong>Licensed IP:</strong> {ipAsset?.title}
            </div>
            <div>
              <strong>{t("verify.ipCreator")}:</strong>{" "}
              {ipCreator?.profile_data.display_name}
            </div>
            <div>
              <strong>{t("verify.licenseStatus")}:</strong> {license?.status}
            </div>
            <div>
              <strong>{t("verify.verificationCode")}:</strong>{" "}
              {authChain?.verification_code}
            </div>
          </div>
        </div>
      </div>

      {/* Authorization Chain */}
      <div className="border-t pt-6">
        <h4 className="font-medium mb-4 flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-primary-600" />
          <span>{t("verify.authorizationChain")}</span>
        </h4>
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Blockchain Hash:</strong>
              <div className="font-mono text-xs break-all mt-1">
                {authChain?.blockchain_hash}
              </div>
            </div>
            <div>
              <strong>{t("verify.created")}:</strong>
              <div className="mt-1">
                {new Date(authChain?.created_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <strong>{t("common.status")}:</strong>
              <div className="mt-1 flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    authChain?.is_active ? "bg-success-500" : "bg-gray-400"
                  }`}
                ></div>
                <span>
                  {authChain?.is_active
                    ? t("verify.active")
                    : t("verify.inactive")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {product && (
          <Link to={`/products/${product.id}`}>
            <Button
              variant="primary"
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              View Product Details
            </Button>
          </Link>
        )}
        {ipAsset && (
          <Link to={`/ip/${ipAsset.id}`}>
            <Button
              variant="secondary"
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              View Original IP
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          onClick={() =>
            navigator.share
              ? navigator.share({
                  title: "Product Verification",
                  text: `Verified authentic product: ${product?.title}`,
                  url: window.location.href,
                })
              : navigator.clipboard.writeText(window.location.href)
          }
        >
          Share Verification
        </Button>
      </div>
    </div>
  );
};

// Verification Failure Component
const VerificationFailure: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-error-600" />
      </div>
      <h3 className="text-lg font-medium text-error-600 mb-2">
        {t("verify.productNotVerified")}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {t("verify.invalidCode")}
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
        <h4 className="font-medium text-yellow-800 mb-2">
          What this could mean:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• The verification code is incorrect or expired</li>
          <li>• The product may be counterfeit</li>
          <li>• The authorization has been revoked</li>
          <li>• There was a technical error</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <div>
          <Link to="/contact">
            <Button variant="secondary">Report Suspected Counterfeit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Recent Verifications Component
const RecentVerifications: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-card">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="font-medium flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-600" />
          <span>{t("verify.recentVerifications")}</span>
        </h3>
      </div>
      <div className="divide-y">
        {mockAuthorizationChain.slice(0, 5).map((chain) => {
          const product = findIPAssetById(chain.ip_asset_id); // Using IP asset as proxy for product
          return (
            <div
              key={chain.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {product?.title || "Product"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>
                        {t("verify.code")}: {chain.verification_code}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(chain.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-success-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {mockAuthorizationChain.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No recent verifications</p>
          <p className="text-sm">
            Start verifying products to see your history here
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
