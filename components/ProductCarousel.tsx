'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  sales: number;
  discount: number;
  colorImages: string[];
  storeId: number;
}

interface ProductCarouselProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductCarousel({ products, onProductClick }: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2;
      const newPosition = direction === 'left' 
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;
      
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  return (
    <div className="relative">
      {/* Left Arrow - Hidden on mobile */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Arrow - Hidden on mobile */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Products Container */}
      <div
        ref={containerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2"
        onScroll={checkScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] xl:w-[calc(16.666%-14px)] snap-start"
          >
            <div
              onClick={() => {
                if (onProductClick) {
                  onProductClick(product);
                }
              }}
              className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group h-full"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50 relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500 text-white text-xs">
                  -{product.discount}%
                </Badge>
              </div>
              <div className="p-3">
                <h4 className="text-xs sm:text-sm text-gray-900 mb-2 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                  {product.title}
                </h4>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-sm sm:text-base text-primary">
                    {product.price.toLocaleString()}₮
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()}₮
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>{product.sales} борлуулалт</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}