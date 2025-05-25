import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Verified,
  Star,
  ShoppingCart,
  Shield,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Heart,
  Share,
  Truck,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { productService } from "../../services/productService";
import {
  findUserById,
  findLicenseApplicationById,
  findIPAssetById,
  findAuthorizationByCode,
} from "../../data/mockData";
import { useCart } from "../../hooks/useCart";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import toast from "react-hot-toast";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useQuery(["product", id], () => productService.getProduct(id!), {
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery(
    ["related-products", id],
    () => productService.getRelatedProducts(id!, 4),
    { enabled: !!id }
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/marketplace">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const seller = findUserById(product.creator_id);
  const license = findLicenseApplicationById(product.license_id);
  const ipAsset = license ? findIPAssetById(license.ip_asset_id) : null;
  const authChain = product
    ? findAuthorizationByCode(`VER-MT-${product.id.padStart(3, "0")}-2024`)
    : null;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addItem(product, quantity, selectedOptions);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addItem(product, quantity, selectedOptions);
    navigate("/checkout");
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(product.inventory_count, quantity + delta)
    );
    setQuantity(newQuantity);
  };

  const handleOptionChange = (optionKey: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionKey]: value }));
  };

  const isProductInCart = isInCart(product.id, selectedOptions);
  const isOutOfStock = product.inventory_count === 0;
  const isLowStock =
    product.inventory_count < 10 && product.inventory_count > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              to="/marketplace"
              className="hover:text-primary-600 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-card">
              <div className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {product.images.length > 1 && (
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
                            product.images.length - 1,
                            selectedImageIndex + 1
                          )
                        )
                      }
                      disabled={
                        selectedImageIndex === product.images.length - 1
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Authenticity Badge */}
                {product.authenticity_verified && (
                  <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Verified className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {product.images.map((image, index) => (
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
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-success-600">
                  ${product.price}
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      isOutOfStock
                        ? "text-error-600"
                        : isLowStock
                        ? "text-warning-600"
                        : "text-success-600"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : `${product.inventory_count} in stock`}
                  </span>
                  {isLowStock && (
                    <span className="text-warning-600 text-sm font-medium">
                      Limited quantity!
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              {product.stats?.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.stats!.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stats.rating} ({product.stats.reviews_count}{" "}
                    reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="text-gray-700 leading-relaxed">
                <p className={showFullDescription ? "" : "line-clamp-3"}>
                  {product.description}
                </p>
                {product.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                  >
                    {showFullDescription ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>

            {/* Product Options */}
            {(product.specifications.sizes ||
              product.specifications.colors) && (
              <div className="space-y-4">
                {/* Size Selection */}
                {product.specifications.sizes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.specifications.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => handleOptionChange("size", size)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            selectedOptions.size === size
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.specifications.colors && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.specifications.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => handleOptionChange("color", color)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            selectedOptions.color === color
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inventory_count}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Maximum {product.inventory_count} available
                </span>
              </div>
            </div>

            {/* Purchase Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  leftIcon={<ShoppingCart className="w-5 h-5" />}
                  className="flex-1"
                >
                  {isProductInCart
                    ? "Added to Cart"
                    : t("marketplace.addToCart")}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1"
                >
                  {t("productDetail.buyNow")}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Heart className="w-4 h-4" />}
                >
                  Save for Later
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Share className="w-4 h-4" />}
                >
                  Share
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12">
          <ProductInfoTabs
            product={product}
            seller={seller}
            ipAsset={ipAsset}
            authChain={authChain}
          />
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="aspect-square">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-success-600">
                        ${relatedProduct.price}
                      </span>
                      {relatedProduct.stats?.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {relatedProduct.stats.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Info Tabs Component
const ProductInfoTabs: React.FC<{
  product: any;
  seller: any;
  ipAsset: any;
  authChain: any;
}> = ({ product, seller, ipAsset, authChain }) => {
  const [activeTab, setActiveTab] = useState("details");
  const { t } = useLanguage();

  const tabs = [
    { id: "details", label: "Details" },
    { id: "authenticity", label: "Authenticity" },
    { id: "seller", label: "Seller Info" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-card">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "details" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {t("productDetail.specifications")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium capitalize text-gray-700">
                    {key.replace("_", " ")}:
                  </span>
                  <span className="text-gray-600">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "authenticity" && (
          <div className="space-y-6">
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-success-800 mb-3 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{t("productDetail.authenticityVerified")}</span>
              </h3>

              {authChain && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-success-900">
                        {t("productDetail.verificationCode")}:
                      </strong>
                      <div className="font-mono text-success-700">
                        {authChain.verification_code}
                      </div>
                    </div>
                    <div>
                      <strong className="text-success-900">
                        {t("productDetail.blockchainHash")}:
                      </strong>
                      <div className="font-mono text-success-700 truncate">
                        {authChain.blockchain_hash}
                      </div>
                    </div>
                  </div>
                  {ipAsset && (
                    <div>
                      <strong className="text-success-900">
                        {t("productDetail.licensedIP")}:
                      </strong>
                      <Link
                        to={`/ip/${ipAsset.id}`}
                        className="text-primary-600 hover:text-primary-800 ml-1"
                      >
                        {ipAsset.title}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Link
                to="/verify"
                className="inline-block mt-4 text-success-700 hover:text-success-900 text-sm font-medium"
              >
                {t("productDetail.viewAuthChain")} →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "seller" && seller && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={seller.profile_data.avatar}
                alt=""
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {seller.profile_data.display_name}
                </h3>
                <p className="text-gray-600">{seller.profile_data.bio}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {seller.profile_data.products_created && (
                    <span>{seller.profile_data.products_created} products</span>
                  )}
                  {seller.profile_data.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{seller.profile_data.rating} rating</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              Contact Seller
            </Button>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button variant="secondary" size="sm">
                Write a Review
              </Button>
            </div>

            {product.stats?.reviews_count > 0 ? (
              <div className="space-y-4">
                {/* Mock reviews */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">5.0</span>
                    <span className="text-sm text-gray-500">• 2 days ago</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Great quality product! Exactly as described and shipped
                    quickly.
                  </p>
                  <p className="text-sm text-gray-500">by Jane D.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
