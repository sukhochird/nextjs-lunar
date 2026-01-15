'use client';

import { ProductCard } from "./ProductCard";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { fetchProducts, convertProduct, fetchStores, Store } from "@/lib/api";

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

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  storeId?: number | null;
  storeName?: string;
  categorySlug?: string;
  categoryName?: string;
  onClearFilter?: () => void;
}

export function ProductGrid({ onProductClick, storeId, storeName, categorySlug, categoryName, onClearFilter }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Map<number, Store>>(new Map());

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts({
          storeId: storeId || undefined,
          category: categorySlug || undefined,
          ordering: '-created_at',
        });
        const convertedProducts = data.results.map(convertProduct);
        setProducts(convertedProducts);

        // Fetch stores for all unique storeIds
        const uniqueStoreIds = [...new Set(convertedProducts.map(p => p.storeId))];
        if (uniqueStoreIds.length > 0) {
          try {
            const storesData = await fetchStores();
            const storeList = storesData.results || storesData;
            const storeMap = new Map<number, Store>();
            storeList.forEach((store: Store) => {
              if (uniqueStoreIds.includes(store.id)) {
                storeMap.set(store.id, store);
              }
            });
            setStores(storeMap);
          } catch (storeErr) {
            console.error('Error loading stores:', storeErr);
          }
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Бүтээгдэхүүн ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [storeId, categorySlug]);

  if (loading) {
    return (
      <div className="flex-1 mb-16 md:mb-0">
        <div className="bg-white rounded-lg p-3 sm:p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base">Ачааллаж байна...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 mb-16 md:mb-0">
        <div className="bg-white rounded-lg p-3 sm:p-6">
          <div className="text-center py-12">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 mb-16 md:mb-0">
      {/* Filter Badges */}
      {(storeId || categorySlug) && (
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Шүүлт:</span>
              {storeId && storeName && (
              <Badge className="bg-primary hover:bg-primary text-xs sm:text-sm px-2 sm:px-3 py-1">
                {storeName}
              </Badge>
              )}
              {categorySlug && categoryName && (
                <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {categoryName}
                </Badge>
              )}
              <span className="text-xs sm:text-sm text-gray-500">
                ({products.length} бүтээгдэхүүн)
              </span>
            </div>
            {onClearFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilter}
                className="gap-1 text-gray-600 hover:text-primary"
              >
                <X className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Шүүлт арилгах</span>
              </Button>
            )}
          </div>
        </div>
      )}


      {/* Product Grid */}
      <div className="bg-white rounded-lg p-3 sm:p-6">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product}
                storeId={product.storeId}
                store={stores.get(product.storeId) || undefined}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              Энэ дэлгүүрт бүтээгдэхүүн олдсонгүй
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
