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
  User,
  Mail,
  CreditCard,
  Truck,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchStore, Store } from '@/lib/api';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart, getDeliveryPrice, getUniqueStoreIds } = useCart();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [storeDeliveryPrices, setStoreDeliveryPrices] = useState<Map<number, number>>(new Map());
  const [loadingStores, setLoadingStores] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Улаанбаатар',
    district: '',
    notes: '',
    paymentMethod: 'cash',
  });

  // Load store delivery prices
  useEffect(() => {
    async function loadStoreDeliveryPrices() {
      const storeIds = getUniqueStoreIds();
      const deliveryMap = new Map<number, number>();
      
      try {
        // Fetch all stores to get delivery prices
        const storesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/stores/`);
        if (storesResponse.ok) {
          const storesData = await storesResponse.json();
          const stores = Array.isArray(storesData.results) ? storesData.results : (Array.isArray(storesData) ? storesData : []);
          
          stores.forEach((store: Store) => {
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
        // Fallback to default price
        storeIds.forEach(storeId => {
          deliveryMap.set(storeId, 5000);
        });
      }
      
      setStoreDeliveryPrices(deliveryMap);
      setLoadingStores(false);
    }

    if (cart.length > 0) {
      loadStoreDeliveryPrices();
    }
  }, [cart, getUniqueStoreIds]);

  const shippingCost = getDeliveryPrice(storeDeliveryPrices);
  const totalWithShipping = getTotalPrice() + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Шаардлагатай талбаруудыг бөглөнө үү');
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    
    // Clear cart after 2 seconds and redirect
    setTimeout(() => {
      clearCart();
      router.push('/');
    }, 3000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl text-gray-900 mb-2">Таны сагс хоосон байна</h2>
          <p className="text-gray-600 mb-6">Захиалга үргэлжлүүлэхийн тулд бараа нэмнэ үү</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90"
          >
            Дэлгүүр рүү буцах
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">Захиалга амжилттай!</h2>
          <p className="text-gray-600 mb-6">
            Таны захиалгыг хүлээн авлаа. Удахгүй холбоо барих болно.
          </p>
          <p className="text-sm text-gray-500">
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Буцах</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-6 sm:mb-8">Захиалга баталгаажуулах</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg text-gray-900">Хүлээн авагчийн мэдээлэл</h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <label className="block text-sm text-gray-700 mb-2">
                      Утас <span className="text-red-500">*</span>
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
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">И-мэйл</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Хот</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Улаанбаатар">Улаанбаатар</option>
                      <option value="Дархан">Дархан</option>
                      <option value="Эрдэнэт">Эрдэнэт</option>
                      <option value="Чойбалсан">Чойбалсан</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Дүүрэг</label>
                    <Input
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Баянзүрх, Сүхбаатар..."
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Хаяг <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Дэлгэрэнгүй хаяг оруулна уу"
                    required
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Нэмэлт тэмдэглэл</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Хүргэлтийн тухай нэмэлт мэдээлэл"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg text-gray-900">Төлбөрийн хэлбэр</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Бэлнээр</p>
                    <p className="text-xs text-gray-500">Хүргэлтийн үед төлнө</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Картаар</p>
                    <p className="text-xs text-gray-500">Онлайн төлбөр</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Шилжүүлэг</p>
                    <p className="text-xs text-gray-500">Дансанд шилжүүлэх</p>
                  </div>
                </label>
              </div>
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

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg text-gray-900 mb-4">Захиалгын дэлгэрэнгүй</h2>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
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

              <div className="flex items-center justify-between pt-4 mb-6">
                <span className="text-base text-gray-900">Нийт:</span>
                <span className="text-2xl text-primary">
                  {totalWithShipping.toLocaleString()}₮
                </span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 shadow-lg shadow-primary/20"
              >
                Захиалга баталгаажуулах
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Аюулгүй төлбөр баталгаатай</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
