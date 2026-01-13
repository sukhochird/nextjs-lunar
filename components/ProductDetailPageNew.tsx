'use client';

import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  Plus,
  Minus,
  ChevronLeft,
  MessageCircle,
  Share2,
  Check,
  Store,
  MapPin,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import { Footer } from "./Footer";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckoutModal } from "./CheckoutModal";
import { ImageCarousel } from "./ImageCarousel";
import { ProductCarousel } from "./ProductCarousel";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  sales: number;
  colorImages: string[];
  storeId?: number;
}

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCartClick?: () => void;
  onProductClick?: (product: Product) => void;
}

// Store data
const stores = [
  {
    id: 1,
    name: "Цагаан сарын цахим экспо",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 1087,
    followers: 15420,
    location: "Улаанбаатар хот",
    responseTime: "1 цагийн дотор",
    verified: true,
    badges: ["Албан ёсны", "Топ 1", "Шуурхай хүргэлт"],
    social: {
      facebook: "https://facebook.com/betterbrandingmn",
      instagram: "https://instagram.com/betterbranding",
      email: "info@betterbranding.mn",
      phone: "+976 9999 1111",
    },
  },
  {
    id: 2,
    name: "Creative Calendar Hub",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 892,
    followers: 12330,
    location: "Улаанбаатар хот",
    responseTime: "2 цагийн дотор",
    verified: true,
    badges: ["Албан ёсны", "Их борлуулалттай"],
    social: {
      facebook: "https://facebook.com/creativecalendar",
      instagram: "https://instagram.com/creativecalendar",
      email: "contact@creativecalendar.mn",
      phone: "+976 8888 2222",
    },
  },
  {
    id: 3,
    name: "Sticker Paradise",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 756,
    followers: 9870,
    location: "Улаанбаатар хот",
    responseTime: "1 цагийн дотор",
    verified: true,
    badges: ["Шуурхай хүргэлт", "Топ 5"],
    social: {
      facebook: "https://facebook.com/stickerparadise",
      instagram: "https://instagram.com/stickerparadise",
      email: "hello@stickerparadise.mn",
      phone: "+976 7777 3333",
    },
  },
  {
    id: 4,
    name: "Digital Print Pro",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 1205,
    followers: 18760,
    location: "Улаанбаатар хот",
    responseTime: "30 минутын дотор",
    verified: true,
    badges: ["Албан ёсны", "Топ 1", "Захиалгат"],
    social: {
      facebook: "https://facebook.com/digitalprintpro",
      instagram: "https://instagram.com/digitalprintpro",
      email: "support@digitalprintpro.mn",
      phone: "+976 9900 4444",
    },
  },
  {
    id: 5,
    name: "Monthly Planner Store",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 634,
    followers: 7650,
    location: "Улаанбаатар хот",
    responseTime: "2 цагийн дотор",
    verified: false,
    badges: ["Шинэ", "Их борлуулалттай"],
    social: {
      facebook: "https://facebook.com/monthlyplanner",
      instagram: "https://instagram.com/monthlyplanner",
      email: "info@monthlyplanner.mn",
      phone: "+976 8800 5555",
    },
  },
  {
    id: 6,
    name: "Art & Design Studio",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 945,
    followers: 11240,
    location: "Улаанаатар хот",
    responseTime: "1 цагийн дотор",
    verified: true,
    badges: ["Албан ёсны", "Захиалгат"],
    social: {
      facebook: "https://facebook.com/artdesignstudio",
      instagram: "https://instagram.com/artdesignstudio",
      email: "contact@artdesignstudio.mn",
      phone: "+976 7700 6666",
    },
  },
];

export function ProductDetailPage({ product, onBack, onCartClick, onProductClick }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { addToCart, getTotalItems } = useCart();

  // Get store info based on product's storeId
  const storeInfo = stores.find(s => s.id === product.storeId) || stores[0];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.colorImages[selectedVariant],
      quantity: quantity,
      variant: selectedVariant,
      storeId: product.storeId,
    });
    
    // Open cart drawer
    if (onCartClick) {
      onCartClick();
    }
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.colorImages[selectedVariant],
      quantity: quantity,
      variant: selectedVariant,
      storeId: product.storeId,
    });
    
    // Open checkout modal
    setIsCheckoutModalOpen(true);
  };

  const reviews = [
    {
      id: 1,
      author: "Батболд С.",
      rating: 5,
      date: "2024-11-01",
      comment: "Маш сайн чанартай бараа. Хурдан хүргэлт. Дахин авна.",
      image: "https://images.unsplash.com/photo-1626207887298-da2fc1f50e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHJldmlldyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ0MDczMHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      author: "Сарантуяа Д.",
      rating: 5,
      date: "2024-10-28",
      comment: "Гайхалтай! Зурган төгс, материал чанартай. Баярлалаа!",
      image: "https://images.unsplash.com/photo-1626207887298-da2fc1f50e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHJldmlldyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ0MDczMHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      author: "Мөнхбат Г.",
      rating: 4,
      date: "2024-10-25",
      comment: "Үнэ чанарын харьцаа маш сайн. Зөвлөж байна.",
      image: "https://images.unsplash.com/photo-1626207887298-da2fc1f50e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHJldmlldyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjQ0MDczMHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Similar products data
  const similarProducts = [
    {
      id: 101,
      image: "https://images.unsplash.com/photo-1642417188964-870c08705ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHBsYW5uZXIlMjBub3RlYm9va3xlbnwxfHx8fDE3Njc1ODA0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "2026 Планнер төлөвлөгч",
      price: 32000,
      originalPrice: 45000,
      sales: 234,
      discount: 29,
      colorImages: ["https://images.unsplash.com/photo-1642417188964-870c08705ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHBsYW5uZXIlMjBub3RlYm9va3xlbnwxfHx8fDE3Njc1ODA0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 1,
    },
    {
      id: 102,
      image: "https://images.unsplash.com/photo-1664238639605-c7dbf2a06ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN0aWNrZXJzfGVufDF8fHx8MTc2NzU4MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Өнгөт наалдац багц",
      price: 15000,
      originalPrice: 22000,
      sales: 567,
      discount: 32,
      colorImages: ["https://images.unsplash.com/photo-1664238639605-c7dbf2a06ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN0aWNrZXJzfGVufDF8fHx8MTc2NzU4MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 3,
    },
    {
      id: 103,
      image: "https://images.unsplash.com/photo-1688413708888-8368d1d99a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJpbnQlMjBkZXNpZ258ZW58MXx8fHwxNzY3NTgwNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Дижитал хэвлэл постер",
      price: 28000,
      originalPrice: 38000,
      sales: 189,
      discount: 26,
      colorImages: ["https://images.unsplash.com/photo-1688413708888-8368d1d99a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJpbnQlMjBkZXNpZ258ZW58MXx8fHwxNzY3NTgwNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 4,
    },
    {
      id: 104,
      image: "https://images.unsplash.com/photo-1582812532891-7968f272fc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwY2FsZW5kYXIlMjBvcмганизэр8ZW58MXx8fHwxNzY3NTgwNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Ширээний календарь",
      price: 24000,
      originalPrice: 32000,
      sales: 412,
      discount: 25,
      colorImages: ["https://images.unsplash.com/photo-1582812532891-7968f272fc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwY2FsZW5kYXIlMjBvcмганизэр8ZW58MXx8fHwxNzY3NTgwNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 2,
    },
    {
      id: 105,
      image: "https://images.unsplash.com/photo-1722197912682-12e963699368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3RhdGlvbmVyeXxlbnwxfHx8fDE3Njc1Njk1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Хөөрхөн бичиг хэрэгсэл",
      price: 18000,
      originalPrice: 26000,
      sales: 345,
      discount: 31,
      colorImages: ["https://images.unsplash.com/photo-1722197912682-12e963699368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3RhdGlvbmVyeXxlbnwxfHx8fDE3Njc1Njk1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 6,
    },
    {
      id: 106,
      image: "https://images.unsplash.com/photo-1695106490532-5628ca08bebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwY2FsZW5kYXIlMjBtb2Rlcm58ZW58MXx8fHwxNzY3NTgwNDcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Ханын календарь 2026",
      price: 35000,
      originalPrice: 48000,
      sales: 298,
      discount: 27,
      colorImages: ["https://images.unsplash.com/photo-1695106490532-5628ca08bebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwY2FsZW5kYXIlMjBtb2Rlcm58ZW58MXx8fHwxNzY3NTgwNDcwfDA&ixlib=rb-4.1.0&q=80&w=1080"],
      storeId: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base">Буцах</span>
            </button>

            {/* Center: Product Title (Hidden on mobile, shown on tablet+) */}
            <div className="hidden md:flex items-center gap-3 flex-1 min-w-0 mx-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <ImageWithFallback
                  src={product.colorImages[selectedVariant]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm lg:text-base text-gray-900 truncate">{product.title}</h2>
                <p className="text-sm text-primary">
                  {product.price.toLocaleString()}₮
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      {product.originalPrice.toLocaleString()}₮
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Хуваалцах"
              >
                <Share2 className="w-5 h-5 text-gray-600 group-hover:text-primary" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Хадгалах"
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500" />
              </button>
              {onCartClick && (
                <button 
                  onClick={onCartClick}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors relative"
                  title="Сагс"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Сагс</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-24 lg:pb-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Left: Image Gallery */}
          <div className="lg:bg-white lg:rounded-2xl lg:p-6 lg:shadow-sm lg:sticky lg:top-24 h-fit -mx-4 sm:-mx-6 lg:mx-0">
            {/* Main Image Slider */}
            <div className="aspect-square lg:rounded-xl overflow-hidden bg-gray-50 mb-4 relative">
              <ImageCarousel
                images={product.colorImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                alt={product.title}
                discount={discount}
              />
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 px-4 sm:px-6 lg:px-0">
              {product.colorImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-4 lg:space-y-6">
            {/* Title & Actions */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 leading-relaxed flex-1">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                    <Share2 className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-5 border-2 border-primary/20">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-primary">
                    <span className="text-3xl sm:text-4xl lg:text-5xl">{product.price.toLocaleString()}</span>
                    <span className="text-xl ml-1">₮</span>
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through text-lg sm:text-xl">
                        {product.originalPrice.toLocaleString()}₮
                      </span>
                      <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border border-red-200">
                        {discount}% хямдарсан
                      </Badge>
                    </>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Таны хэмнэлт: <span className="text-green-600">{(product.originalPrice! - product.price).toLocaleString()}₮</span>
                  </p>
                )}
              </div>
            </div>

            {/* Merchant Info Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                <Store className="w-5 h-5 text-primary" />
                <h3 className="text-base sm:text-lg text-gray-900">Борлуулагчийн мэдээлэл</h3>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <ImageWithFallback
                  src={storeInfo.image}
                  alt={storeInfo.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg text-gray-900 mb-3">{storeInfo.name}</h4>
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={storeInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1877F2] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1877F2]/10 group-hover:bg-[#1877F2]/20 flex items-center justify-center transition-colors">
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                      </div>
                      <span className="text-xs">Facebook</span>
                    </a>
                    <a
                      href={storeInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#E4405F] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#E4405F]/10 group-hover:bg-[#E4405F]/20 flex items-center justify-center transition-colors">
                        <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                      </div>
                      <span className="text-xs">Instagram</span>
                    </a>
                    <a
                      href={`tel:${storeInfo.social.phone}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-green-600/10 group-hover:bg-green-600/20 flex items-center justify-center transition-colors">
                        <Phone className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-xs">{storeInfo.social.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/5"
                  size="sm"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Дэлгүүр үзэх
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Холбоо барих
                </Button>
              </div>
            </div>

            {/* Guarantee Icons */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-gray-900">Үнэгүй хүргэлт</span>
                  <span className="text-xs text-gray-500">50,000₮-с дээш</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2">
                    <RefreshCw className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-gray-900">7 хоног</span>
                  <span className="text-xs text-gray-500">Буцаалт</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-gray-900">100% жинхэнэ</span>
                  <span className="text-xs text-gray-500">Баталгаатай</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-gray-900">Аюулгүй</span>
                  <span className="text-xs text-gray-500">Төлбөр</span>
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              {/* Quantity */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm sm:text-base text-gray-900">Тоо ширхэг</span>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-base text-gray-900 min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base text-gray-700">Нийт үнэ:</span>
                  <span className="text-2xl sm:text-3xl text-primary">
                    {(product.price * quantity).toLocaleString()}₮
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="hidden lg:flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl h-12 sm:h-14 transition-all hover:scale-105"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Сагсанд нэмэх
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 sm:h-14 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    size="lg"
                    onClick={handleBuyNow}
                  >
                    Худалдаж авах
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 lg:mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0 overflow-x-auto">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap"
              >
                Дэлгэрэнгүй
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap"
              >
                Тодорхойлолт
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap"
              >
                Сэтгэгдэл ({reviews.length})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap"
              >
                Хүргэлт
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-4 sm:p-8">
              <div className="prose max-w-none">
                <h3 className="text-lg lg:text-xl text-gray-900 mb-4">
                  Бүтээгдэхүүний тайлбар
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                  {product.title} нь өндөр чанартай материалаар хийгдсэн бөгөөд таны хэрэгцээнд тохирсон төгс бүтээгдэхүүн юм. Энэхүү бүтээгдэхүүн нь дэлхийн жишигт нийцсэн бөгөөд урт хугацаанд ашиглах боломжтой.
                </p>
                <h4 className="text-base lg:text-lg text-gray-900 mb-3">
                  Онцлог шинж чанарууд:
                </h4>
                <ul className="space-y-2 text-sm lg:text-base text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Өндөр чанартай материал ашигласан</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Орчин үеийн дизайн, загвартай</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Урт хугацаанд ашиглах боломжтой</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Байгаль орчинд ээлтэй</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Олон хувбар сонголттой</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="p-4 sm:p-8">
              <div className="space-y-4">
                <h3 className="text-lg lg:text-xl text-gray-900 mb-4">
                  Тхникийн тодорхойлолт
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Барааны код</span>
                    <span className="text-sm lg:text-base text-gray-900">
                      #{product.id.toString().padStart(6, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Хувилбар</span>
                    <span className="text-sm lg:text-base text-gray-900">
                      {product.colorImages.length} төрөл
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Борлуулагч</span>
                    <span className="text-sm lg:text-base text-gray-900">{storeInfo.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Гарал үүсэл</span>
                    <span className="text-sm lg:text-base text-gray-900">Монгол</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Батагаа</span>
                    <span className="text-sm lg:text-base text-gray-900">30 хоног</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Нөхцөл</span>
                    <span className="text-sm lg:text-base text-gray-900">Шинэ</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-4 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg lg:text-xl text-gray-900">Худалдан авагчийн сэтгэгдэл</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-base lg:text-lg">4.9</span>
                    <span className="text-sm text-gray-500">({reviews.length})</span>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-xl p-4 lg:p-5 border border-gray-100 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={review.image}
                          alt={review.author}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm lg:text-base text-gray-900">
                              {review.author}
                            </span>
                            <span className="text-xs lg:text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}</div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="p-4 sm:p-8">
              <div className="space-y-6">
                <h3 className="text-lg lg:text-xl text-gray-900 mb-4">
                  Хүргэлтийн мэдээлэл
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-base text-gray-900 mb-1">Хүргэлтийн хугацаа</h4>
                      <p className="text-sm text-gray-600">
                        Уланбаатар хот: 1-2 хоног<br />
                        Орон нутаг: 3-5 хоног
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-base text-gray-900 mb-1">Хүргэлтийн зардал</h4>
                      <p className="text-sm text-gray-600">
                        50,000₮-с дээш захиалгад үнэгүй<br />
                        50,000₮-с доош: 5,000₮
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <RefreshCw className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-base text-gray-900 mb-1">Буцаалтын бодлого</h4>
                      <p className="text-sm text-gray-600">
                        7 хоногийн дотор эх хэвээр нь буцаах боломжтой<br />
                        Буцаалтын зардал: Худалдан авагч хариуцна
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-900">Ижил төстэй бараанууд</h3>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Бүгдийг үзэх →
            </button>
          </div>

          {/* Similar Products Carousel */}
          <div className="relative px-0 sm:px-6">
            <ProductCarousel
              products={similarProducts}
              onProductClick={onProductClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
              <Button
                className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl h-11"
                size="sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                <span className="text-xs sm:text-sm">Сагсанд</span>
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-11 shadow-lg shadow-primary/20"
                size="sm"
                onClick={handleBuyNow}
              >
                <span className="text-xs sm:text-sm">Худалдаж авах</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}