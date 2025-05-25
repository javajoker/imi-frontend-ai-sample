import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Verified,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCart } from "../../hooks/useCart";
import { findUserById } from "../../data/mockData";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";

const CartPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    selectedOptions?: Record<string, string>
  ) => {
    if (newQuantity < 1) {
      removeItem(productId, selectedOptions);
    } else {
      updateQuantity(productId, newQuantity, selectedOptions);
    }
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-heading-2 mb-1">{t("cart.title")}</h1>
              <p className="text-gray-600">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Shopping Cart</h2>
                    <button
                      onClick={clearCart}
                      className="text-error-600 hover:text-error-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y">
                  {items.map((item, index) => (
                    <CartItem
                      key={`${item.product.id}-${index}`}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center">
                <Link to="/marketplace">
                  <Button
                    variant="secondary"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-card sticky top-4">
                <h3 className="text-lg font-medium mb-4">
                  {t("cart.orderSummary")}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>
                      {t("cart.subtotal")} ({getTotalItems()} {t("cart.items")})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("cart.shipping")}</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-success-600 font-medium">
                          Free
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("cart.tax")}</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && subtotal < 50 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Free shipping</strong> on orders over $50!
                        <br />
                        Add ${(50 - subtotal).toFixed(2)} more to qualify.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-medium">
                    <span>{t("cart.total")}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  leftIcon={<ShoppingCart className="w-5 h-5" />}
                >
                  {t("cart.proceedCheckout")}
                </Button>

                {/* Security & Trust Indicators */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Verified className="w-4 h-4 text-success-500" />
                      <span>All products are authenticity verified</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ShoppingCart className="w-4 h-4 text-primary-500" />
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ArrowLeft className="w-4 h-4 text-gray-400" />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem: React.FC<{
  item: any;
  onQuantityChange: (
    productId: string,
    quantity: number,
    options?: Record<string, string>
  ) => void;
  onRemove: (productId: string, options?: Record<string, string>) => void;
}> = ({ item, onQuantityChange, onRemove }) => {
  const { t } = useLanguage();
  const { product, quantity, selectedOptions } = item;
  const seller = findUserById(product.creator_id);

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="flex-shrink-0">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-20 h-20 object-cover rounded-lg hover:opacity-75 transition-opacity"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product.id}`}
            className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
          >
            {product.title}
          </Link>

          <div className="mt-1 text-sm text-gray-600">
            by {seller?.profile_data.display_name}
          </div>

          {/* Selected Options */}
          {selectedOptions && Object.keys(selectedOptions).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(selectedOptions).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                >
                  {`${key}: ${value}`}
                </span>
              ))}
            </div>
          )}

          {/* Authenticity Badge */}
          {product.authenticity_verified && (
            <div className="mt-2 flex items-center space-x-1 text-success-600">
              <Verified className="w-4 h-4" />
              <span className="text-sm">Authenticity Verified</span>
            </div>
          )}

          {/* Mobile Price & Quantity */}
          <div className="mt-3 sm:hidden">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">
                ${(product.price * quantity).toFixed(2)}
              </div>
              <QuantitySelector
                quantity={quantity}
                onChange={(newQuantity) =>
                  onQuantityChange(product.id, newQuantity, selectedOptions)
                }
                onRemove={() => onRemove(product.id, selectedOptions)}
              />
            </div>
          </div>
        </div>

        {/* Desktop Price & Quantity */}
        <div className="hidden sm:flex sm:items-center sm:space-x-6">
          {/* Unit Price */}
          <div className="text-center">
            <div className="text-sm text-gray-500">Unit Price</div>
            <div className="text-lg font-medium">${product.price}</div>
          </div>

          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            onChange={(newQuantity) =>
              onQuantityChange(product.id, newQuantity, selectedOptions)
            }
            onRemove={() => onRemove(product.id, selectedOptions)}
          />

          {/* Total Price */}
          <div className="text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-bold text-gray-900">
              ${(product.price * quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quantity Selector Component
const QuantitySelector: React.FC<{
  quantity: number;
  onChange: (quantity: number) => void;
  onRemove: () => void;
}> = ({ quantity, onChange, onRemove }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onChange(quantity - 1)}
          className="p-2 hover:bg-gray-100 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-3 py-2 min-w-[3rem] text-center">{quantity}</span>
        <button
          onClick={() => onChange(quantity + 1)}
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// Empty Cart Component
const EmptyCart: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>

      <h2 className="text-2xl font-medium text-gray-900 mb-2">
        {t("cart.emptyCart")}
      </h2>
      <p className="text-gray-600 mb-8">{t("cart.emptyCartDesc")}</p>

      <div className="space-y-4">
        <Link to="/marketplace">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ShoppingBag className="w-5 h-5" />}
          >
            {t("cart.shopProducts")}
          </Button>
        </Link>

        <div className="text-sm text-gray-500">
          or{" "}
          <Link
            to="/browse-ip"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            browse IP assets
          </Link>{" "}
          to license
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Popular Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/marketplace?category=Apparel"
            className="text-sm text-gray-600 hover:text-primary-600 p-2 rounded hover:bg-white transition-colors"
          >
            Apparel
          </Link>
          <Link
            to="/marketplace?category=Home Decor"
            className="text-sm text-gray-600 hover:text-primary-600 p-2 rounded hover:bg-white transition-colors"
          >
            Home Decor
          </Link>
          <Link
            to="/marketplace?category=Accessories"
            className="text-sm text-gray-600 hover:text-primary-600 p-2 rounded hover:bg-white transition-colors"
          >
            Accessories
          </Link>
          <Link
            to="/marketplace?category=Art"
            className="text-sm text-gray-600 hover:text-primary-600 p-2 rounded hover:bg-white transition-colors"
          >
            Art & Prints
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
