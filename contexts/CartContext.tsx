'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant: number;
  storeId?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDeliveryPrice: (storeDeliveryPrices: Map<number, number>) => number;
  getUniqueStoreIds: () => number[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart((prevCart) => {
      // Check if item with same productId and variant already exists
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.productId === item.productId && cartItem.variant === item.variant
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      } else {
        // Add new item with unique ID
        const newId = prevCart.length > 0 ? Math.max(...prevCart.map(i => i.id)) + 1 : 1;
        return [...prevCart, { ...item, id: newId }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getUniqueStoreIds = () => {
    const storeIds = cart
      .map(item => item.storeId)
      .filter((id): id is number => id !== undefined);
    return Array.from(new Set(storeIds));
  };

  const getDeliveryPrice = (storeDeliveryPrices: Map<number, number>) => {
    const uniqueStoreIds = getUniqueStoreIds();
    return uniqueStoreIds.reduce((total, storeId) => {
      const deliveryPrice = storeDeliveryPrices.get(storeId) || 0;
      return total + deliveryPrice;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getDeliveryPrice,
        getUniqueStoreIds,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
