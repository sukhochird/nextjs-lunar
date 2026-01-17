'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { createOrder, CreateOrderRequest } from '@/lib/api';
import {
  Phone,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: Array<{
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    variant: number;
    optionId?: number;
    storeId?: number;
  }>; // Optional: specific items to checkout (for Buy Now)
}

export function CheckoutModal({ isOpen, onClose, items }: CheckoutModalProps) {
  const { cart, getTotalPrice, clearCart, getDeliveryPrice, getUniqueStoreIds } = useCart();
  
  // Use provided items or fall back to cart
  const checkoutItems = items || cart;
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [storeDeliveryPrices, setStoreDeliveryPrices] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<{
    invoiceUrl?: string;
    qrCode?: string;
    qrImage?: string; // Base64 encoded QR code image
    invoiceId?: string;
    urls?: Array<{
      name: string;
      link: string;
      logo?: string;
      description?: string;
    }>; // Payment deep links
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
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

  // Calculate checkout total price
  const getCheckoutTotalPrice = () => {
    return checkoutItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get unique store IDs from checkout items
  const getCheckoutUniqueStoreIds = () => {
    const storeIds = new Set<number>();
    checkoutItems.forEach(item => {
      if (item.storeId) {
        storeIds.add(item.storeId);
      }
    });
    return Array.from(storeIds);
  };

  const shippingCost = getDeliveryPrice(storeDeliveryPrices);
  const totalWithShipping = getCheckoutTotalPrice() + shippingCost;

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

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Бүх шаардлагатай талбаруудыг бөглөнө үү');
      return;
    }

    // Validate phone number: must be exactly 8 digits
    if (formData.phone.length !== 8) {
      alert('Утасны дугаар 8 оронтой тоо байх ёстой');
      return;
    }

    if (checkoutItems.length === 0) {
      alert('Сагс хоосон байна');
      return;
    }

    // Get store ID from checkout items (assuming all items are from same store or first store)
    const storeIds = getCheckoutUniqueStoreIds();
    if (storeIds.length === 0) {
      alert('Дэлгүүр олдсонгүй');
      return;
    }

    // For now, use the first store. In future, you might want to create separate orders per store
    const storeId = storeIds[0];
    const deliveryPrice = storeDeliveryPrices.get(storeId) || 0;

    setLoading(true);
    setError(null);

    try {
      // Prepare order items
      const orderItems = checkoutItems.map(item => ({
        product_id: item.productId,
        option_id: item.optionId || null,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order request
      const orderRequest: CreateOrderRequest = {
        store_id: storeId,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        items: orderItems,
        delivery_price: deliveryPrice,
      };

      // Create order via API
      const response = await createOrder(orderRequest);

      if (response.success && response.invoice) {
        setOrderData({
          invoiceUrl: response.invoice.invoice_url,
          qrCode: response.invoice.qr_code,
          qrImage: response.invoice.qr_image,
          invoiceId: response.invoice.invoice_id,
          urls: response.invoice.urls,
        });
        setStep('payment');
      } else {
        throw new Error('Захиалга үүсгэхэд алдаа гарлаа');
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Захиалга үүсгэхэд алдаа гарлаа');
      alert(err.message || 'Захиалга үүсгэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    setStep('info');
    setFormData({ name: '', phone: '', address: '' });
    setOrderData(null);
    setError(null);
    onClose();
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
                    <span className="text-gray-900">{getCheckoutTotalPrice().toLocaleString()}₮</span>
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
                  <label className="block text-sm text-gray-700 mb-2">
                    Нэр <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Таны нэр"
                    required
                    className="rounded-lg"
                  />
                </div>

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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Захиалга үүсгэж байна...' : 'Төлбөр төлөх'}
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

              {/* QPay QR Code */}
              {(orderData?.qrImage || orderData?.qrCode) && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                  <h3 className="text-sm text-gray-700 mb-3 text-center">
                    QPay QR код уншуулж төлбөр төлөх
                  </h3>
                  <div className="flex justify-center mb-3">
                    {orderData.qrImage ? (
                      <img
                        src={`data:image/png;base64,${orderData.qrImage}`}
                        alt="QPay Payment QR Code"
                        className="w-48 h-48 rounded-lg border border-gray-200 p-2 bg-white"
                      />
                    ) : (
                      <ImageWithFallback
                        src={orderData.qrCode || ''}
                        alt="QPay Payment QR Code"
                        className="w-48 h-48 rounded-lg border border-gray-200"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center mb-3">
                    QR кодыг QPay апп-аар уншуулж төлбөрөө төлнө үү
                  </p>
                  {orderData.invoiceUrl && (
                    <div className="text-center">
                      <a
                        href={orderData.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Нэхэмжлэхэд нэвтрэх
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Deep Links */}
              {orderData?.urls && orderData.urls.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm text-gray-700 mb-3 font-semibold">Төлбөр төлөх</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {orderData.urls.map((urlItem, index) => (
                      <a
                        key={index}
                        href={urlItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-colors"
                      >
                        {urlItem.logo ? (
                          <img
                            src={urlItem.logo}
                            alt={urlItem.name}
                            className="w-12 h-12 object-contain mb-2"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-gray-400 text-xs">{urlItem.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-900 text-center">{urlItem.name}</p>
                        {urlItem.description && (
                          <p className="text-xs text-gray-500 text-center mt-1">{urlItem.description}</p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* QPay Invoice Link */}
              {orderData?.invoiceUrl && (
                <div className="bg-white rounded-xl p-4 space-y-3">
                  <h3 className="text-sm text-gray-700 mb-2">QPay Нэхэмжлэх</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-800 mb-3">
                      QPay нэхэмжлэхээр төлбөрөө төлөх бол доорх холбоосоор нэвтрэнэ үү
                    </p>
                    <a
                      href={orderData.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Нэхэмжлэхэд нэвтрэх
                    </a>
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm text-gray-700 mb-2">Хүргэлтийн мэдээлэл</h3>
                <div className="flex items-start gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Нэр</p>
                    <p className="text-sm text-gray-900">{formData.name}</p>
                  </div>
                </div>
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
                onClick={() => {
                  // Clear cart if using cart items
                  if (!items) {
                    clearCart();
                  }
                  setStep('success');
                  // Redirect to store after 3 seconds
                  setTimeout(() => {
                    handleClose();
                    // Optionally redirect to store page
                    // window.location.href = '/';
                  }, 3000);
                }}
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
