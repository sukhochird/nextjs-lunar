'use client';

import { useCart } from '@/contexts/CartContext';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  MapPin,
  Phone,
  ShoppingCart,
  CheckCircle2,
  Copy,
  Truck,
  CreditCard,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CheckoutPage({ onBack, onSuccess }: CheckoutPageProps) {
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

    if (cart.length > 0) {
      loadStoreDeliveryPrices();
    }
  }, [cart, getUniqueStoreIds]);

  const shippingCost = getDeliveryPrice(storeDeliveryPrices);
  const totalWithShipping = getTotalPrice() + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.phone || !formData.address) {
      alert('Утасны дугаар болон хүргэх хаягаа оруулна уу');
      return;
    }

    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setStep('success');
    
    // Clear cart after 2 seconds and redirect
    setTimeout(() => {
      clearCart();
      onSuccess();
    }, 3000);
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

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl text-gray-900 mb-2">Таны сагс хоосон байна</h2>
          <p className="text-gray-600 mb-6">Захиалга үргэлжлүүлэхийн тулд бараа нэмнэ үү</p>
          <Button
            onClick={onBack}
            className="bg-primary hover:bg-primary/90"
          >
            Дэлгүүр рүү буцах
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">Захиалга амжилттай!</h2>
          <p className="text-gray-600 mb-6">
            Таны захиалгыг хүлээн авлаа. Төлбөр баталгаажсаны дараа бид тантай холбоо барих болно.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              Хүргэлт: 1-2 хоногийн дотор
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Та дэлгүүр рүү автоматаар шилжих болно...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={step === 'payment' ? () => setStep('info') : onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Буцах</span>
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {step === 'info' ? (
          <>
            <h1 className="text-2xl sm:text-3xl text-gray-900 mb-6">Захиалга баталгаажуулах</h1>

            <div className="grid grid-cols-1 gap-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Захиалгын дэлгэрэнгүй
                </h2>

                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.price.toLocaleString()}₮ × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {(item.price * item.quantity).toLocaleString()}₮
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Барааны үнэ:</span>
                    <span className="text-gray-900">{getTotalPrice().toLocaleString()}₮</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Хүргэлт:</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shippingCost === 0 ? 'Үнэгүй' : `${shippingCost.toLocaleString()}₮`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-base text-gray-900">Нийт:</span>
                  <span className="text-2xl text-primary">
                    {totalWithShipping.toLocaleString()}₮
                  </span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg text-gray-900 mb-4">Холбоо барих мэдээлэл</h2>

                <form onSubmit={handleContinueToPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Утасны дугаар <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9999-1111"
                      required
                      className="rounded-lg"
                    />
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
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 shadow-lg shadow-primary/20"
                  >
                    Төлбөр төлөх
                  </Button>
                </form>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base text-gray-900 mb-2">Хүргэлтийн мэдээлэл</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Улаанбаатар хот: 1-2 хоног</li>
                      <li>• Орон нутаг: 3-5 хоног</li>
                      <li>• 50,000₮-с дээш захиалгад үнэгүй хүргэлт</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Төлбөр төлөх
            </h1>

            <div className="grid grid-cols-1 gap-6">
              {/* Order Total */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border-2 border-primary/20 text-center">
                <p className="text-sm text-gray-600 mb-2">Төлөх дүн</p>
                <p className="text-4xl text-primary">
                  {totalWithShipping.toLocaleString()}₮
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <h3 className="text-base text-gray-700 mb-4 text-center">
                  QR код уншуулж төлбөр төлөх
                </h3>
                <div className="flex justify-center mb-4">
                  <ImageWithFallback
                    src={bankDetails.qrCode}
                    alt="Payment QR Code"
                    className="w-56 h-56 rounded-lg border border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  QR кодыг банкны апп-аар уншуулж төлбөрөө төлнө үү
                </p>
              </div>

              {/* Bank Transfer Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base text-gray-700 mb-2">Дансны мэдээлэл</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Банк</p>
                      <p className="text-sm text-gray-900">{bankDetails.bankName}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Дансны дугаар</p>
                      <p className="text-base text-gray-900">{bankDetails.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(bankDetails.accountNumber)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-primary" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Дансны нэр</p>
                      <p className="text-sm text-gray-900">{bankDetails.accountName}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(bankDetails.accountName)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Анхаар:</strong> Төлбөрийн утга хэсэгт утасны дугаараа бичнэ үү
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h3 className="text-base text-gray-700 mb-3">Хүргэлтийн мэдээлэл</h3>
                <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Утас</p>
                    <p className="text-sm text-gray-900">{formData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Хаяг</p>
                    <p className="text-sm text-gray-900">{formData.address}</p>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <Button
                onClick={handlePaymentComplete}
                className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12 shadow-lg"
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
      </div>
    </div>
  );
}