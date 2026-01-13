'use client';

import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchCategories, Category as ApiCategory } from '@/lib/api';

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { getTotalItems } = useCart();

  useEffect(() => {
    async function loadCategoryInfo() {
      try {
        setLoading(true);
        const categories = await fetchCategories();
        // Find category by slug (check both parent and subcategories)
        let foundCategory: ApiCategory | undefined;
        
        for (const cat of categories) {
          if (cat.slug === slug) {
            foundCategory = cat;
            break;
          }
          if (cat.subcategories) {
            const subCat = cat.subcategories.find(sub => sub.slug === slug);
            if (subCat) {
              foundCategory = subCat;
              break;
            }
          }
        }
        
        if (foundCategory) {
          setCategoryName(foundCategory.name);
        } else {
          setCategoryName('Ангилал');
        }
      } catch (err) {
        console.error('Error loading category:', err);
        setCategoryName('Ангилал');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCategoryInfo();
    }
  }, [slug]);

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
          <ProductGrid 
            onProductClick={(product) => router.push(`/products/${product.id}`)}
            categorySlug={slug}
            categoryName={categoryName}
            onClearFilter={() => router.push('/')}
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

