'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Phone,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Copy,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, getTotalPrice, clearCart, getDeliveryPrice, getUniqueStoreIds } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [storeDeliveryPrices, setStoreDeliveryPrices] = useState<Map<number, number>>(new Map());
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
  });

  // Load store delivery prices
  useEffect(() => {
    async function loadStoreDeliveryPrices() {
      const storeIds = getUniqueStoreIds();
      const deliveryMap = new Map<number, number>();
      
      try {
        const storesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/stores/`);
        if (storesResponse.ok) {
          const storesData = await storesResponse.json();
          const stores = Array.isArray(storesData.results) ? storesData.results : (Array.isArray(storesData) ? storesData : []);
          
          stores.forEach((store: any) => {
            if (storeIds.includes(store.id)) {
              const deliveryPrice = typeof store.delivery_price === 'number' 
                ? store.delivery_price 
                : (store.delivery_price ? parseFloat(String(store.delivery_price)) || 5000 : 5000);
              deliveryMap.set(store.id, deliveryPrice);
            }
          });
        }
      } catch (error) {
        console.error('Error loading store delivery prices:', error);
        storeIds.forEach(storeId => {
          deliveryMap.set(storeId, 5000);
        });
      }
      
      setStoreDeliveryPrices(deliveryMap);
    }

    if (cart.length > 0 && isOpen) {
      loadStoreDeliveryPrices();
    }
  }, [cart, isOpen, getUniqueStoreIds]);

  const shippingCost = getDeliveryPrice(storeDeliveryPrices);
  const totalWithShipping = getTotalPrice() + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Phone number validation: only numbers, max 8 digits
    if (name === 'phone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 8 digits
      const limitedValue = digitsOnly.slice(0, 8);
      setFormData({
        ...formData,
        phone: limitedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address) {
      alert('Утасны дугаар болон хүргэх хаягаа оруулна уу');
      return;
    }

    // Validate phone number: must be exactly 8 digits
    if (formData.phone.length !== 8) {
      alert('Утасны дугаар 8 оронтой тоо байх ёстой');
      return;
    }

    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setStep('success');
    
    // Clear cart and close modal after showing success
    setTimeout(() => {
      clearCart();
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setStep('info');
    setFormData({ phone: '', address: '' });
    onClose();
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Хуулагдлаа!');
  };

  // Bank account details
  const bankDetails = {
    bankName: 'Хаан банк',
    accountNumber: '5123456789',
    accountName: 'Цагаан сарын цахим экспо',
    qrCode: 'https://images.unsplash.com/photo-1609520778163-a16fb3b0453e?w=400&h=400&fit=crop',
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        {/* Info Step */}
        {step === 'info' && (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Захиалга баталгаажуулах
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm text-gray-700 mb-2">Захиалгын дэлгэрэнгүй</h3>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 line-clamp-1 text-xs">{item.title}</p>
                        <p className="text-gray-600 text-xs">{item.quantity} ширхэг</p>
                      </div>
                      <p className="text-gray-900 text-xs">
                        {(item.price * item.quantity).toLocaleString()}₮
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Барааны үнэ:</span>
                    <span className="text-gray-900">{getTotalPrice().toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Хүргэлт:</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shippingCost === 0 ? 'Үнэгүй' : `${shippingCost.toLocaleString()}₮`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base text-gray-900">Нийт:</span>
                    <span className="text-xl text-primary">
                      {totalWithShipping.toLocaleString()}₮
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContinueToPayment} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="99991111"
                    required
                    className="rounded-lg"
                    maxLength={8}
                    pattern="[0-9]{8}"
                    inputMode="numeric"
                  />
                  {formData.phone && formData.phone.length !== 8 && (
                    <p className="text-xs text-red-500 mt-1">
                      Утасны дугаар 8 оронтой тоо байх ёстой
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Хүргэх хаяг <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Дэлгэрэнгүй хаяг оруулна уу (хот, дүүрэг, байр, тоот)"
                    required
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12"
                >
                  Төлбөр төлөх
                </Button>
              </form>
            </div>
          </>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
              <button
                onClick={() => setStep('info')}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Буцах</span>
              </button>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Төлбөр төлөх
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-4">
              {/* Order Total */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border-2 border-primary/20 text-center">
                <p className="text-sm text-gray-600 mb-1">Төлөх дүн</p>
                <p className="text-3xl text-primary">
                  {totalWithShipping.toLocaleString()}₮
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                <h3 className="text-sm text-gray-700 mb-3 text-center">
                  QR код уншуулж төлбөр төлөх
                </h3>
                <div className="flex justify-center mb-3">
                  <ImageWithFallback
                    src={bankDetails.qrCode}
                    alt="Payment QR Code"
                    className="w-48 h-48 rounded-lg border border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  QR кодыг банкны апп-аар уншуулж төлбөрөө төлнө үү
                </p>
              </div>

              {/* Bank Transfer Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm text-gray-700 mb-2">Дансны мэдээлэл</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Банк</p>
                      <p className="text-sm text-gray-900">{bankDetails.bankName}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Дансны дугаар</p>
                      <p className="text-sm text-gray-900">{bankDetails.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(bankDetails.accountNumber)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Дансны нэр</p>
                      <p className="text-sm text-gray-900">{bankDetails.accountName}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(bankDetails.accountName)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Анхаар:</strong> Төлбөрийн утга хэсэгт утасны дугаараа бичнэ үү
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm text-gray-700 mb-2">Хүргэлтийн мэдээлэл</h3>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Утас</p>
                    <p className="text-sm text-gray-900">{formData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Хаяг</p>
                    <p className="text-sm text-gray-900">{formData.address}</p>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <Button
                onClick={handlePaymentComplete}
                className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Төлбөр төлсөн
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Төлбөр төлсний дараа энэ товчийг дарна уу. Бид таны захиалгыг хүлээн авч, удахгүй холбоо барих болно.
              </p>
            </div>
          </>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <>
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl text-gray-900">Захиалга амжилттай!</h2>
              <p className="text-gray-600">
                Таны захиалгыг хүлээн авлаа. Төлбөр баталгаажсаны дараа бид тантай холбоо барих болно.
              </p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  Хүргэлт: 1-2 хоногийн дотор
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Та автоматаар дэлгүүр рүү шилжих болно...
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
