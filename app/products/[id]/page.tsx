'use client';

import { ProductDetailPage } from '@/components/ProductDetailPage';
import { CartDrawer } from '@/components/CartDrawer';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProduct, convertProduct, ProductDetail } from '@/lib/api';

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  sellingPrice?: number;
  discountPercentage?: number;
  sales: number;
  colorImages: string[];
  storeId?: number;
  store?: any; // Store object from API
  slug?: string; // Product slug for API calls
  description?: string; // Product description from API
  category?: any; // Category object from API
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const productId = params.id as string;
        
        if (!productId) {
          setError('Бүтээгдэхүүний ID олдсонгүй');
          setLoading(false);
          return;
        }
        
        console.log('Fetching product with ID/slug:', productId);
        const apiProduct = await fetchProduct(productId);
        
        if (!apiProduct) {
          setError('Бүтээгдэхүүн олдсонгүй');
          setLoading(false);
          return;
        }
        
        // Convert API product to frontend format
        const basePrice = parseFloat(apiProduct.price);
        const discountPercentage = apiProduct.discount_percentage || 0;
        const sellingPrice = apiProduct.selling_price || basePrice;
        
        const convertedProduct = {
          id: apiProduct.id,
          image: apiProduct.image || apiProduct.color_images?.[0] || '',
          title: apiProduct.title,
          price: basePrice,
          originalPrice: discountPercentage > 0 ? basePrice : undefined,
          sellingPrice: discountPercentage > 0 ? sellingPrice : undefined,
          discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
          sales: apiProduct.sales || 0,
          colorImages: apiProduct.color_images?.length > 0 ? apiProduct.color_images : [apiProduct.image || ''],
          storeId: apiProduct.store?.id || apiProduct.store_id,
          store: apiProduct.store, // Include full store object
          slug: apiProduct.slug, // Include slug for similar products API
          description: apiProduct.description || '', // Include description from API
          category: apiProduct.category, // Include category from API
          options: apiProduct.options || [], // Include product options
        };
        
        setProduct(convertedProduct);
      } catch (err: any) {
        console.error('Error loading product:', err);
        if (err?.message?.includes('404') || err?.message?.includes('Not Found')) {
          setError('Бүтээгдэхүүн олдсонгүй');
        } else if (err?.message?.includes('Failed to fetch')) {
          setError('API серверт холбогдох боломжгүй байна. Backend сервер ажиллаж байгаа эсэхийг шалгана уу.');
        } else {
          setError(err?.message || 'Бүтээгдэхүүн ачаалахад алдаа гарлаа');
        }
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">{error || 'Бүтээгдэхүүн олдсонгүй'}</h1>
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductDetailPage
        product={product}
        onBack={() => router.push('/')}
        onCartClick={() => setIsCartOpen(true)}
      />
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
