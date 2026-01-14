'use client';

import { Menu, Store, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import exampleImage from "figma:asset/f7d6d44386b41c9f47dae3ede1a054b67df3075e.png";
import logoImage from "@/assets/logo.png";

interface HeaderProps {
  onMenuClick: () => void;
  onStoreListClick?: () => void;
  onCartClick?: () => void;
  cartItemsCount?: number;
}

export function Header({ onMenuClick, onStoreListClick, onCartClick, cartItemsCount }: HeaderProps) {
  const router = useRouter();
  const tabs = [
    "Нүүр хуудас",
    "Шинэ бүтээгдэхүүн",
    "Их борлуулалттай",
    "Ангилал",
    "Купон",
    "VIP бүс",
  ];

  return (
    <header className="bg-white rounded-lg shadow-sm sticky top-0 z-50">
      {/* Mobile Simple Header - Sticky - Full Width */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="flex items-center gap-2 px-4 py-2.5 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 p-2 h-auto"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          <img
            src={typeof logoImage === 'string' ? logoImage : logoImage.src}
            alt="Цагаан сарын цахим экспо"
            className="h-9 object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-gray-900 truncate">
              Цагаан сарын цахим экспо
            </h1>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onStoreListClick && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto hidden sm:flex"
                onClick={onStoreListClick}
              >
                <Store className="h-5 w-5 text-gray-700" />
              </Button>
            )}
            {onCartClick && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto relative"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartItemsCount !== undefined && cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header - Sticky */}
      <div className="hidden md:block sticky top-0 z-50 bg-white px-3 sm:px-6 py-2 sm:py-3">
        {/* Top Row */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-6 mb-3 sm:mb-4">
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden flex-shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Store Info Section */}
          <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Store Image with NEW badge */}
            <div className="relative flex-shrink-0">
              <img
                src={typeof logoImage === 'string' ? logoImage : logoImage.src}
                alt="Цагаан сарын цахим экспо"
                className="h-12 sm:h-20 object-cover border-gray-100"
              />
            </div>

            {/* Store Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                <h1 className="text-gray-900 text-sm sm:text-base truncate">
                  Цагаан сарын цахим экспо
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-pink-500 hover:bg-pink-500 text-xs">
                    Official
                  </Badge>
                </div>
              </div>

              {/* Tags Row */}
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-red-50 text-red-600 hover:bg-red-50 text-[10px] sm:text-xs px-1.5 sm:px-2"
                >
                  Customized order
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-600 hover:bg-orange-50 text-[10px] sm:text-xs px-1.5 sm:px-2"
                >
                  Шуурхай хүргэлт
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-[10px] sm:text-xs px-1.5 sm:px-2"
                >
                  Топ 1
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {onStoreListClick && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onStoreListClick}
              >
                <Store className="h-4 w-4" />
                <span className="hidden lg:inline">Дэлгүүрүүд</span>
              </Button>
            )}
            {onCartClick && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 relative"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden lg:inline">Сагс</span>
                {cartItemsCount !== undefined && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            )}
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => router.push('/open-store')}
            >
              <Store className="h-4 w-4" />
              <span className="hidden lg:inline">Дэлгүүр нээх</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-100 pt-2 sm:pt-3 -mx-3 sm:-mx-6 px-3 sm:px-6">
          <nav className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`pb-2 text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  index === 0
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}