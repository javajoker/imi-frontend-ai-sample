import { useState, useEffect } from "react";
import { CartItem, Product } from "../types";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

// Custom hook for cart management
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { t } = useLanguage();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (
    product: Product,
    quantity: number = 1,
    selectedOptions?: Record<string, string>
  ) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(t("messages.success.addedToCart"));
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          selectedOptions,
        };
        toast.success(t("messages.success.addedToCart"));
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeItem = (
    productId: string,
    selectedOptions?: Record<string, string>
  ) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            JSON.stringify(item.selectedOptions) ===
              JSON.stringify(selectedOptions)
          )
      )
    );
  };

  // Update item quantity
  const updateQuantity = (
    productId: string,
    newQuantity: number,
    selectedOptions?: Record<string, string>
  ) => {
    if (newQuantity <= 0) {
      removeItem(productId, selectedOptions);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  // Get total price
  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Get total items count
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if product is in cart
  const isInCart = (
    productId: string,
    selectedOptions?: Record<string, string>
  ) => {
    return items.some(
      (item) =>
        item.product.id === productId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );
  };

  // Get item from cart
  const getItem = (
    productId: string,
    selectedOptions?: Record<string, string>
  ) => {
    return items.find(
      (item) =>
        item.product.id === productId &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItem,
  };
};
