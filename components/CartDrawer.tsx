'use client';

import { useCart } from '@/contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { CheckoutModal } from './CheckoutModal';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false);
    onClose(); // Also close the cart drawer when checkout modal closes
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="text-lg text-gray-900">
              Сагс ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Таны сагс хоосон байна</p>
              <p className="text-sm text-gray-400">Бараа нэмэхийн тулд дэлгүүрээс сонгоно уу</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-primary mb-2">
                    {item.price.toLocaleString()}₮
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm text-gray-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}₮
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Нийт үнэ:</span>
              <span className="text-2xl text-primary">
                {getTotalPrice().toLocaleString()}₮
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 shadow-lg shadow-primary/20"
            >
              Худалдаж авах
            </Button>
            <button
              onClick={onClose}
              className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
            >
              Үргэлжлүүлэн худалдаж авах
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckout}
      />
    </>
  );
}