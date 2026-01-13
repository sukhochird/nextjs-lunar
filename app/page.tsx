'use client';

import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryBar } from '@/components/CategoryBar';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface StoreFilter {
  id: number;
  name: string;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [storeFilter, setStoreFilter] = useState<StoreFilter | null>(null);
  const { getTotalItems } = useCart();

  // Load store filter from URL params
  useEffect(() => {
    const storeId = searchParams.get('storeId');
    const storeName = searchParams.get('storeName');
    
    if (storeId && storeName) {
      setStoreFilter({
        id: parseInt(storeId),
        name: decodeURIComponent(storeName)
      });
    }
  }, [searchParams]);

  const handleClearFilter = () => {
    setStoreFilter(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          onStoreListClick={() => router.push('/stores')}
          onCartClick={() => setIsCartOpen(true)}
          cartItemsCount={getTotalItems()}
        />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2 sm:py-4 flex gap-3 sm:gap-4 pb-20 md:pb-6">
        <CategorySidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 min-w-0">
          <CategoryBar />
          <ProductGrid 
            onProductClick={(product) => router.push(`/products/${product.id}`)}
            storeId={storeFilter?.id}
            storeName={storeFilter?.name}
            onClearFilter={handleClearFilter}
          />
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => router.push('/cart/checkout')}
      />
      <Footer />
      <MobileBottomNav
        activeTab="home"
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