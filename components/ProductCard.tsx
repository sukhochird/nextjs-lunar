import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { fetchStore, Store } from "@/lib/api";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  sellingPrice?: number;
  discountPercentage?: number;
  colorImages: string[];
  storeId: number;
  store?: Store;
  minPrice?: number;
  maxPrice?: number;
  hasOptions?: boolean;
  onClick?: () => void;
}

export function ProductCard({
  image,
  title,
  price,
  originalPrice,
  sellingPrice,
  discountPercentage,
  colorImages,
  storeId,
  store: storeProp,
  minPrice,
  maxPrice,
  hasOptions,
  onClick,
}: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(image);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [store, setStore] = useState<Store | null>(storeProp || null);

  useEffect(() => {
    if (storeProp) {
      setStore(storeProp);
    } else {
      // Fallback: fetch store if not provided
      async function loadStore() {
        try {
          const storesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/stores/`);
          if (storesResponse.ok) {
            const storesData = await storesResponse.json();
            const storeList = storesData.results || storesData;
            const foundStore = storeList.find((s: Store) => s.id === storeId);
            if (foundStore) {
              setStore(foundStore);
            }
          }
        } catch (err) {
          console.error('Error loading store:', err);
        }
      }
      loadStore();
    }
  }, [storeId, storeProp]);

  return (
    <div className="bg-white rounded-lg overflow-hidden cursor-pointer group" onClick={onClick}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="pt-2 sm:pt-3">
        {/* Color Selection Thumbnails */}
        <div className="flex items-center gap-1 mb-2 overflow-x-auto scrollbar-hide">
          {colorImages.map((imgUrl, index) => (
            <ImageWithFallback
              key={index}
              src={imgUrl}
              alt={`${title} variant ${index + 1}`}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0 border-2 cursor-pointer transition-colors ${
                hoveredIndex === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onMouseEnter={() => {
                setCurrentImage(imgUrl);
                setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                setCurrentImage(image);
                setHoveredIndex(null);
              }}
              onClick={() => {
                setCurrentImage(imgUrl);
                setHoveredIndex(index);
              }}
            />
          ))}
        </div>

        {/* Product Title */}
        <h3 className="text-base sm:text-sm text-gray-900 mb-0 line-clamp-2">
          {title}
        </h3>

        {/* Seller Info */}
        {store && (
          <div className="flex items-center gap-1.5 mb-1.5 mt-0.5">
            <img
              src={store.image}
              alt={store.name}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-[10px] sm:text-xs text-gray-600 truncate">
              {store.name}
            </span>
            {store.verified && (
              <Badge className="bg-pink-500 hover:bg-pink-500 text-[8px] sm:text-[10px] px-1 py-0 h-3 sm:h-4">
                ✓
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          {hasOptions && minPrice !== undefined && maxPrice !== undefined && minPrice !== maxPrice ? (
            // Show price range when options exist
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-[#912F56]">
                <span className="text-base sm:text-xl">{minPrice.toLocaleString()}</span>
                <span className="text-xs sm:text-sm">₮</span>
                <span className="text-xs sm:text-sm mx-1">-</span>
                <span className="text-base sm:text-xl">{maxPrice.toLocaleString()}</span>
                <span className="text-xs sm:text-sm">₮</span>
              </span>
            </div>
          ) : discountPercentage && discountPercentage > 0 && sellingPrice ? (
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-[#912F56]">
                <span className="text-base sm:text-xl">{sellingPrice.toLocaleString()}</span>
                <span className="text-xs sm:text-sm">₮</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {price.toLocaleString()}₮
              </span>
              <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border border-red-200 text-[10px] sm:text-xs px-1.5 py-0.5">
                {Math.round(discountPercentage)}% хямдарсан
              </Badge>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-[#912F56]">
                <span className="text-base sm:text-xl">{price.toLocaleString()}</span>
                <span className="text-xs sm:text-sm">₮</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}