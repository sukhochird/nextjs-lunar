'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchStore, fetchStoreProducts, convertProduct, Store as ApiStore } from '@/lib/api';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { CartDrawer } from '@/components/CartDrawer';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryBar } from '@/components/CategoryBar';
import { ProductCard } from '@/components/ProductCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Users, TrendingUp, Clock, CheckCircle2, Facebook, Instagram, Mail, Phone, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  sellingPrice?: number;
  discountPercentage?: number;
  colorImages: string[];
  storeId: number;
}

function StoreProfileContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { getTotalItems } = useCart();
  
  const [store, setStore] = useState<ApiStore | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function loadStore() {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const storeData = await fetchStore(slug);
        setStore(storeData);
      } catch (err) {
        console.error('Error loading store:', err);
        setError('Дэлгүүр олдсонгүй');
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, [slug]);

  useEffect(() => {
    async function loadProducts() {
      if (!slug) return;
      
      try {
        setProductsLoading(true);
        const data = await fetchStoreProducts(slug, {
          ordering: '-created_at',
        });
        const convertedProducts = data.results.map(convertProduct);
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setProductsLoading(false);
      }
    }

    if (store) {
      loadProducts();
    }
  }, [slug, store]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        {/* Mobile Header - Full Width */}
        <div className="md:hidden">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onStoreListClick={() => router.push('/stores')}
            onCartClick={() => setIsCartOpen(true)}
            cartItemsCount={getTotalItems()}
          />
        </div>
        
        {/* Desktop Header - Inside Container */}
        <div className="hidden md:block max-w-[1400px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onStoreListClick={() => router.push('/stores')}
            onCartClick={() => setIsCartOpen(true)}
            cartItemsCount={getTotalItems()}
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Ачааллаж байна...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        {/* Mobile Header - Full Width */}
        <div className="md:hidden">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onStoreListClick={() => router.push('/stores')}
            onCartClick={() => setIsCartOpen(true)}
            cartItemsCount={getTotalItems()}
          />
        </div>
        
        {/* Desktop Header - Inside Container */}
        <div className="hidden md:block max-w-[1400px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onStoreListClick={() => router.push('/stores')}
            onCartClick={() => setIsCartOpen(true)}
            cartItemsCount={getTotalItems()}
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Дэлгүүр олдсонгүй'}</p>
            <Button
              onClick={() => router.push('/stores')}
              className="mt-4"
            >
              Дэлгүүрийн жагсаалт руу буцах
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Mobile Header - Full Width */}
      <div className="md:hidden">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          onStoreListClick={() => router.push('/stores')}
          onCartClick={() => setIsCartOpen(true)}
          cartItemsCount={getTotalItems()}
        />
      </div>
      
      {/* Desktop Header - Inside Container */}
      <div className="hidden md:block max-w-[1400px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          onStoreListClick={() => router.push('/stores')}
          onCartClick={() => setIsCartOpen(true)}
          cartItemsCount={getTotalItems()}
        />
      </div>

      {/* Mobile CategoryBar - Full Width */}
      <div className="md:hidden">
        <CategoryBar 
          onCategorySelect={() => {}}
          activeCategorySlug={null}
        />
      </div>

      {/* Main Content - Same Layout as Homepage */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2 sm:py-4 flex gap-3 sm:gap-4 pb-20 md:pb-6">
        <CategorySidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 min-w-0">
          {/* Merchant Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 mb-4">
              <Store className="w-5 h-5 text-primary" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Борлуулагчийн мэдээлэл</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Store Image */}
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={store.image}
                  alt={store.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-gray-100"
                />
              </div>

              {/* Store Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">{store.name}</h4>
                  {store.verified && (
                    <Badge className="bg-pink-500 hover:bg-pink-500 text-white text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  {store.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{store.rating}</span>
                    </div>
                  )}
                  {store.location && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm">{store.location}</span>
                    </div>
                  )}
                  {store.followers > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs sm:text-sm">{store.followers.toLocaleString()} дагагч</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {store.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{store.description}</p>
                )}

                {/* Social Links */}
                {store.social && (store.social.facebook || store.social.instagram || store.social.email || store.social.phone) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {store.social.facebook && (
                      <a
                        href={store.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs transition-colors"
                      >
                        <Facebook className="w-3 h-3" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {store.social.instagram && (
                      <a
                        href={store.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded text-xs transition-colors"
                      >
                        <Instagram className="w-3 h-3" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {store.social.phone && (
                      <a
                        href={`tel:${store.social.phone}`}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded text-xs transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{store.social.phone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-base">Бүтээгдэхүүн ачааллаж байна...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onClick={() => router.push(`/products/${product.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-base">Энэ дэлгүүрт бүтээгдэхүүн олдсонгүй</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => router.push('/cart/checkout')}
      />
      <Footer />
      <MobileBottomNav
        activeTab="stores"
        onTabChange={(tab) => {
          if (tab === 'home') {
            router.push('/');
          } else if (tab === 'categories') {
            setIsSidebarOpen(true);
          } else if (tab === 'stores') {
            router.push('/stores');
          } else if (tab === 'cart') {
            setIsCartOpen(true);
          }
        }}
        cartItemsCount={getTotalItems()}
      />
    </div>
  );
}

export default function StoreProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    }>
      <StoreProfileContent />
    </Suspense>
  );
}
