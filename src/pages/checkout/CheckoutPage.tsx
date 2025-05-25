import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Check,
  CreditCard,
  Lock,
  ArrowLeft,
  ArrowRight,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  Truck,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCart } from "../../hooks/useCart";
import { ShippingInfo, PaymentInfo } from "../../types";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";

interface CheckoutFormData {
  // Shipping
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;

  // Options
  saveAddress: boolean;
  savePayment: boolean;
}

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      country: "United States",
    },
  });

  const shippingCost = 9.99;
  const taxRate = 0.08;
  const subtotal = getTotalPrice();
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const steps = [
    { id: 1, name: "Shipping", icon: Truck },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Check },
    { id: 4, name: "Confirmation", icon: CheckCircle },
  ];

  // Redirect if cart is empty
  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const handleStepValidation = async (step: number) => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "email",
          "address",
          "city",
          "zipCode",
        ];
        break;
      case 2:
        fieldsToValidate = ["cardNumber", "expiryDate", "cvv", "nameOnCard"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleNextStep = async () => {
    const isValid = await handleStepValidation(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderNumber(orderNum);
      setOrderPlaced(true);
      clearCart();

      // Navigate to step 4 (confirmation)
      setCurrentStep(4);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Order Confirmation Screen
  if (orderPlaced && currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>

          <h1 className="text-2xl font-bold text-success-600 mb-2">
            {t("checkout.orderConfirmed")}
          </h1>

          <p className="text-gray-600 mb-8">{t("checkout.thankYou")}</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-sm text-gray-600 mb-2">
              {t("checkout.orderNumber")}
            </div>
            <div className="font-mono text-lg font-bold">#{orderNumber}</div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/dashboard")}
            >
              {t("checkout.viewOrderDetails")}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate("/marketplace")}
            >
              {t("checkout.continueShopping")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Cart</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("checkout.title")}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : isCompleted
                        ? "text-success-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : isCompleted
                          ? "bg-success-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{step.name}</span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-px mx-2 ${
                        currentStep > step.id ? "bg-success-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-responsive py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("checkout.shippingInformation")}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">
                        <User className="w-4 h-4 inline mr-2" />
                        {t("checkout.firstName")} *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${
                          errors.firstName ? "border-error-500" : ""
                        }`}
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                      />
                      {errors.firstName && (
                        <p className="form-error">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">
                        {t("checkout.lastName")} *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${
                          errors.lastName ? "border-error-500" : ""
                        }`}
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                      />
                      {errors.lastName && (
                        <p className="form-error">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email *
                      </label>
                      <input
                        type="email"
                        className={`form-input ${
                          errors.email ? "border-error-500" : ""
                        }`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="form-error">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="form-input"
                        {...register("phone")}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        {t("checkout.address")} *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${
                          errors.address ? "border-error-500" : ""
                        }`}
                        {...register("address", {
                          required: "Address is required",
                        })}
                      />
                      {errors.address && (
                        <p className="form-error">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">
                        {t("checkout.city")} *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${
                          errors.city ? "border-error-500" : ""
                        }`}
                        {...register("city", { required: "City is required" })}
                      />
                      {errors.city && (
                        <p className="form-error">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register("state")}
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        {t("checkout.zipCode")} *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${
                          errors.zipCode ? "border-error-500" : ""
                        }`}
                        {...register("zipCode", {
                          required: "ZIP code is required",
                        })}
                      />
                      {errors.zipCode && (
                        <p className="form-error">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Country *</label>
                      <select
                        className="form-input"
                        {...register("country", {
                          required: "Country is required",
                        })}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded"
                        {...register("saveAddress")}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Save this address for future orders
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("checkout.paymentMethod")}
                  </h2>

                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="radio"
                          id="credit-card"
                          name="paymentMethod"
                          defaultChecked
                          className="text-primary-600"
                        />
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <label htmlFor="credit-card" className="font-medium">
                          {t("checkout.creditCard")}
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="form-label">
                            {t("checkout.cardNumber")} *
                          </label>
                          <input
                            type="text"
                            placeholder={t("checkout.cardNumberPlaceholder")}
                            className={`form-input ${
                              errors.cardNumber ? "border-error-500" : ""
                            }`}
                            {...register("cardNumber", {
                              required: "Card number is required",
                              pattern: {
                                value: /^[0-9\s]{13,19}$/,
                                message: "Please enter a valid card number",
                              },
                            })}
                          />
                          {errors.cardNumber && (
                            <p className="form-error">
                              {errors.cardNumber.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="form-label">
                            {t("checkout.expiryDate")} *
                          </label>
                          <input
                            type="text"
                            placeholder={t("checkout.expiryPlaceholder")}
                            className={`form-input ${
                              errors.expiryDate ? "border-error-500" : ""
                            }`}
                            {...register("expiryDate", {
                              required: "Expiry date is required",
                              pattern: {
                                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                message:
                                  "Please enter a valid expiry date (MM/YY)",
                              },
                            })}
                          />
                          {errors.expiryDate && (
                            <p className="form-error">
                              {errors.expiryDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="form-label">
                            {t("checkout.cvv")} *
                          </label>
                          <input
                            type="text"
                            placeholder={t("checkout.cvvPlaceholder")}
                            className={`form-input ${
                              errors.cvv ? "border-error-500" : ""
                            }`}
                            {...register("cvv", {
                              required: "CVV is required",
                              pattern: {
                                value: /^[0-9]{3,4}$/,
                                message: "Please enter a valid CVV",
                              },
                            })}
                          />
                          {errors.cvv && (
                            <p className="form-error">{errors.cvv.message}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="form-label">Name on Card *</label>
                          <input
                            type="text"
                            className={`form-input ${
                              errors.nameOnCard ? "border-error-500" : ""
                            }`}
                            {...register("nameOnCard", {
                              required: "Name on card is required",
                            })}
                          />
                          {errors.nameOnCard && (
                            <p className="form-error">
                              {errors.nameOnCard.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded"
                          {...register("savePayment")}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Save this payment method for future orders
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("checkout.reviewOrder")}
                  </h2>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 py-4 border-b border-gray-200"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {item.product.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                          {item.selectedOptions &&
                            Object.entries(item.selectedOptions).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="text-xs text-gray-500"
                                >
                                  {key}: {value}
                                </div>
                              )
                            )}
                        </div>
                        <div className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isLoading && (
                    <div className="mt-6 text-center">
                      <LoadingSpinner text={t("checkout.processingDesc")} />
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    {t("common.back")}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {currentStep === 2
                      ? t("checkout.reviewOrder")
                      : t("checkout.continuePayment")}
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    {t("common.back")}
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    leftIcon={<Lock className="w-4 h-4" />}
                  >
                    {t("checkout.placeOrder")}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-card sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Lock className="w-4 h-4 text-success-500" />
                    <span>256-bit SSL encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
