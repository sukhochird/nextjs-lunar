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
  ChevronRight,
} from "lucide-react";
import { Footer } from "./Footer";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { fetchSimilarProducts, convertProduct } from "@/lib/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckoutModal } from "./CheckoutModal";
import Slider from "react-slick";

interface ProductOption {
  id: number;
  name: string;
  price_modifier: number;
  final_price: number;
  order: number;
  is_active: boolean;
}

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
  options?: ProductOption[]; // Product options
}

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCartClick?: () => void;
  onProductClick?: (product: Product) => void;
}

export function ProductDetailPage({ product, onBack, onCartClick, onProductClick }: ProductDetailPageProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { addToCart, getTotalItems } = useCart();
  const mainSliderRef = useRef<Slider>(null);

  // Get store info from product's store object (from API)
  const storeInfo = product.store ? {
    id: product.store.id,
    name: product.store.name,
    image: product.store.image,
    location: product.store.location || '',
    verified: product.store.verified || false,
    delivery_price: typeof product.store.delivery_price === 'number' 
      ? product.store.delivery_price 
      : (product.store.delivery_price ? parseFloat(String(product.store.delivery_price)) || 5000 : 5000),
    badges: product.store.tags?.map((tag: any) => tag.name) || [],
    social: {
      facebook: product.store.social?.facebook || '',
      instagram: product.store.social?.instagram || '',
      email: product.store.social?.email || '',
      phone: product.store.social?.phone || '',
    },
  } : null;

  // Calculate discount percentage
  const discountPercentage = product.discountPercentage || 
    (product.originalPrice && product.price ? 
      Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
  
  // Alias for backward compatibility
  const discount = discountPercentage;
  
  // Calculate price based on selected option
  const getCurrentPrice = () => {
    const basePrice = product.sellingPrice || product.price;
    if (product.options && product.options.length > 0 && selectedOption !== null) {
      const option = product.options.find(opt => opt.id === selectedOption);
      if (option) {
        return option.final_price;
      }
    }
    return basePrice;
  };
  
  // Use selling price if available, otherwise use regular price
  const displayPrice = getCurrentPrice();

  // Slider settings for main images
  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    beforeChange: (current: number, next: number) => setSelectedImage(next),
    customPaging: (i: number) => (
      <div className="w-2 h-2 rounded-full bg-gray-300 hover:bg-primary transition-colors mt-4" />
    ),
    dotsClass: "slick-dots !flex !justify-center !items-center gap-2 !bottom-3",
  };

  // Slider settings for similar products
  const similarProductsSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };

  // Similar products - fetch from API
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    async function loadSimilarProducts() {
      try {
        setLoadingSimilar(true);
        // Use product slug if available, otherwise use ID
        const identifier = product.slug || product.id.toString();
        const apiProducts = await fetchSimilarProducts(identifier);
        const converted = apiProducts.map(convertProduct);
        setSimilarProducts(converted);
      } catch (err) {
        console.error('Error loading similar products:', err);
        setSimilarProducts([]);
      } finally {
        setLoadingSimilar(false);
      }
    }

    if (product.id) {
      loadSimilarProducts();
    }
  }, [product.id, product.slug]);

  const handleAddToCart = () => {
    // If options exist and none selected, show alert
    if (product.options && product.options.length > 0 && selectedOption === null) {
      alert('Сонголт хийх шаардлагатай');
      return;
    }
    
    addToCart({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      image: product.colorImages[selectedVariant],
      quantity: quantity,
      variant: selectedVariant,
      optionId: selectedOption || undefined,
      storeId: product.storeId,
    });
    
    // Open cart drawer
    if (onCartClick) {
      onCartClick();
    }
  };

  const handleBuyNow = () => {
    // Don't add to cart, just open checkout with this specific item
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-primary transition-all group flex-shrink-0 active:scale-95"
              aria-label="Буцах"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Буцах</span>
            </button>

            {/* Center: Product Title (Hidden on mobile, shown on tablet+) */}
            <div className="hidden md:flex items-center gap-3 flex-1 min-w-0 mx-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                <ImageWithFallback
                  src={product.colorImages[selectedVariant]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm lg:text-base font-semibold text-gray-900 truncate">{product.title}</h2>
                <p className="text-sm text-primary font-medium">
                  {displayPrice.toLocaleString()}₮
                  {product.originalPrice && discountPercentage > 0 && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      {product.originalPrice.toLocaleString()}₮
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button 
                className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all group touch-manipulation"
                title="Хуваалцах"
                aria-label="Хуваалцах"
              >
                <Share2 className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600 group-hover:text-primary transition-colors" />
              </button>
              <button 
                className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all group touch-manipulation"
                title="Хадгалах"
                aria-label="Хадгалах"
              >
                <Heart className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
              </button>
              {onCartClick && (
                <button 
                  onClick={onCartClick}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 text-primary rounded-lg transition-all relative touch-manipulation"
                  title="Сагс"
                  aria-label="Сагс"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm font-medium">Сагс</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 pb-28 sm:pb-32 lg:pb-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Left: Image Gallery */}
          <div className="lg:bg-white lg:rounded-2xl lg:p-6 lg:shadow-sm lg:sticky lg:top-24 h-fit -mx-4 sm:-mx-6 lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Image Slider */}
            <div className="aspect-square lg:rounded-xl overflow-hidden bg-gray-50 mb-3 sm:mb-4 relative group">
              <Slider ref={mainSliderRef} {...mainSliderSettings}>
                {product.colorImages.map((image, index) => (
                  <div key={index} className="aspect-square relative">
                    <ImageWithFallback
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {discount > 0 && index === selectedImage && (
                      <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm z-10 shadow-lg animate-in zoom-in duration-300">
                        -{discount}% OFF
                      </Badge>
                    )}
                  </div>
                ))}
              </Slider>
              
              {/* Image Counter - Mobile */}
              <div className="lg:hidden absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md z-10">
                {selectedImage + 1} / {product.colorImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 px-4 sm:px-6 lg:px-0">
              {product.colorImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    mainSliderRef.current?.slickGoTo(index);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 touch-manipulation ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary/30 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:scale-105"
                  }`}
                  aria-label={`Select image ${index + 1}`}
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
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            {/* Title & Actions */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight flex-1">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <button className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all group touch-manipulation" aria-label="Хуваалцах">
                    <Share2 className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  </button>
                  <button className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all group touch-manipulation" aria-label="Хадгалах">
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 sm:p-5 border-2 border-primary/20 shadow-sm">
                {discountPercentage > 0 && product.sellingPrice ? (
                  <>
                    <div className="flex items-baseline gap-3 mb-2 sm:mb-3 flex-wrap">
                      <span className="text-primary font-bold">
                        <span className="text-3xl sm:text-4xl lg:text-5xl">{product.sellingPrice.toLocaleString()}</span>
                        <span className="text-xl sm:text-2xl ml-1">₮</span>
                      </span>
                      <span className="text-gray-400 line-through text-lg sm:text-xl lg:text-2xl">
                        {product.price.toLocaleString()}₮
                      </span>
                      <Badge className="bg-red-500 text-white hover:bg-red-600 border-0 shadow-md text-xs sm:text-sm px-2.5 py-1">
                        {discountPercentage}% хямдарсан
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      Таны хэмнэлт: <span className="text-green-600 font-bold">{(product.price - product.sellingPrice).toLocaleString()}₮</span>
                    </p>
                  </>
                ) : (
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="text-primary font-bold">
                      <span className="text-3xl sm:text-4xl lg:text-5xl">{product.price.toLocaleString()}</span>
                      <span className="text-xl sm:text-2xl ml-1">₮</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Merchant Info Card - Expanded */}
            {storeInfo && (
              <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Store className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Борлуулагчийн мэдээлэл</h3>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <button
                    onClick={() => router.push(`/stores/${product.store?.slug || ''}`)}
                    className="flex-shrink-0 hover:opacity-80 transition-opacity active:scale-95 touch-manipulation"
                    aria-label={`${storeInfo.name} дэлгүүр үзэх`}
                  >
                  <ImageWithFallback
                    src={storeInfo.image}
                    alt={storeInfo.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 bg-gray-50 cursor-pointer"
                  />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => router.push(`/stores/${product.store?.slug || ''}`)}
                      className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap hover:opacity-80 transition-opacity active:scale-95 touch-manipulation group"
                      aria-label={`${storeInfo.name} дэлгүүр үзэх`}
                    >
                      <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">{storeInfo.name}</h4>
                      {storeInfo.verified && (
                        <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-2 py-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </button>
                    
                    {/* Social Links & Contact - Horizontal circular buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {storeInfo.social.facebook && (
                        <a
                          href={storeInfo.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-gray-700 hover:text-[#1877F2] transition-colors group touch-manipulation"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1877F2]/10 group-hover:bg-[#1877F2]/20 flex items-center justify-center transition-colors">
                            <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1877F2]" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">Facebook</span>
                        </a>
                      )}
                      {storeInfo.social.instagram && (
                        <a
                          href={storeInfo.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-gray-700 hover:text-[#E4405F] transition-colors group touch-manipulation"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E4405F]/10 group-hover:bg-[#E4405F]/20 flex items-center justify-center transition-colors">
                            <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E4405F]" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">Instagram</span>
                        </a>
                      )}
                      {storeInfo.social.phone && (
                        <a
                          href={`tel:${storeInfo.social.phone}`}
                          className="flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition-colors group touch-manipulation"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600/10 group-hover:bg-green-600/20 flex items-center justify-center transition-colors">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{storeInfo.social.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            {product.description && (
              <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Бүтээгдэхүүний тайлбар
                </h3>
                <div 
                  className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                />
              </div>
            )}

            {/* Quantity & Purchase */}
            <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100 space-y-4 sm:space-y-5">
              {/* Option Selection */}
              {product.options && product.options.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm sm:text-base font-medium text-gray-900">Сонголт</span>
                  <div className="flex flex-wrap gap-2">
                    {product.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedOption === option.id
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{option.name}</span>
                          {option.price_modifier !== 0 && (
                            <span className={`text-xs ${
                              option.price_modifier > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {option.price_modifier > 0 ? '+' : ''}
                              {option.price_modifier.toLocaleString()}₮
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedOption !== null && (
                    <p className="text-sm text-gray-600">
                      Сонгосон үнэ: <span className="font-semibold text-primary">
                        {product.options.find(opt => opt.id === selectedOption)?.final_price.toLocaleString()}₮
                      </span>
                    </p>
                  )}
                </div>
              )}
              
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-medium text-gray-900">Тоо ширхэг</span>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                    aria-label="Багасгах"
                  >
                    <Minus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700" />
                  </button>
                  <span className="text-base sm:text-lg font-bold text-gray-900 min-w-[32px] sm:min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-all touch-manipulation"
                    aria-label="Нэмэх"
                  >
                    <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Total Price - Compact */}
              <div className="pt-4 sm:pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Нийт үнэ:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xl sm:text-2xl lg:text-3xl text-primary font-bold">
                    {((displayPrice * quantity) + (storeInfo?.delivery_price || 5000)).toLocaleString()}₮
                  </span>
                    {storeInfo?.delivery_price && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        (Хүргэлт: {storeInfo.delivery_price.toLocaleString()}₮)
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="hidden lg:flex flex-col gap-3">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 rounded-xl h-12 sm:h-14 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold text-base"
                    size="lg"
                    onClick={handleBuyNow}
                  >
                    Худалдаж авах
                  </Button>
                  <Button
                    className="w-full bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl h-12 sm:h-14 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold text-base"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Сагсанд нэмэх
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 lg:mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0 overflow-x-auto scrollbar-hide">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 lg:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap text-sm sm:text-base font-medium transition-all touch-manipulation"
              >
                Дэлгэрэнгүй
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 lg:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap text-sm sm:text-base font-medium transition-all touch-manipulation"
              >
                Тодорхойлолт
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 lg:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap text-sm sm:text-base font-medium transition-all touch-manipulation"
              >
                Сэтгэгдэл ({reviews.length})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 lg:px-8 py-3 sm:py-4 data-[state=active]:text-primary whitespace-nowrap text-sm sm:text-base font-medium transition-all touch-manipulation"
              >
                Хүргэлт
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-4 sm:p-6 lg:p-8">
              <div className="prose max-w-none">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5">
                  Бүтээгдэхүүний тайлбар
                </h3>
                {product.description ? (
                  <div 
                    className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                ) : (
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                    {product.title} нь өндөр чанартай материалаар хийгдсэн бөгөөд таны хэрэгцээнд тохирсон төгс бүтээгдэхүүн юм. Энэхүү бүтээгдэхүүн нь дэлхийн жишигт нийцсэн бөгөөд урт хугацаанд ашиглах боломжтой.
                  </p>
                )}
                <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Онцлог шинж чанарууд:
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span>Өндөр чанартай материал ашигласан</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span>Орчин үеийн дизайн, загвартай</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span>Урт хугацаанд ашиглах боломжтой</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span>Байгаль орчинд ээлтэй</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span>Олон хувбар сонголттой</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Техникийн тодорхойлолт
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Барааны код</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                      #{product.id.toString().padStart(6, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Хувилбар</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                      {product.colorImages.length} төрөл
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Борлуулагч</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">{storeInfo?.name || 'Тодорхойгүй'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Гарал үүсэл</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">Монгол</span>
                  </div>
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Баталгаа</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">30 хоног</span>
                  </div>
                  <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Нөхцөл</span>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">Шинэ</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Худалдан авагчийн сэтгэгдэл</h3>
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">4.9</span>
                    <span className="text-sm sm:text-base text-gray-600">({reviews.length})</span>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4 sm:space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <ImageWithFallback
                          src={review.image}
                          alt={review.author}
                          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                            <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                              {review.author}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex mb-2 sm:mb-3 gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Хүргэлтийн мэдээлэл
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-3 sm:gap-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Хүргэлтийн хугацаа</h4>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Улаанбаатар хот: <span className="font-semibold text-primary">1-2 хоног</span><br />
                        Орон нутаг: <span className="font-semibold text-primary">3-5 хоног</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Хүргэлтийн зардал</h4>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        <span className="font-semibold text-green-600">50,000₮-с дээш</span> захиалгад үнэгүй<br />
                        50,000₮-с доош: <span className="font-semibold">{storeInfo?.delivery_price?.toLocaleString() || '5,000'}₮</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Буцаалтын бодлого</h4>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        <span className="font-semibold text-primary">7 хоногийн дотор</span> эх хэвээр нь буцаах боломжтой<br />
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Ижил төстэй бараанууд</h3>
            <button className="text-sm sm:text-base text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1 group">
              Бүгдийг үзэх
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Similar Products Grid */}
          {loadingSimilar ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Ачааллаж байна...</p>
              </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {similarProducts.map((similarProduct) => {
                const discount = similarProduct.originalPrice 
                  ? Math.round(((similarProduct.originalPrice - similarProduct.price) / similarProduct.originalPrice) * 100)
                  : 0;
                
                return (
                  <div
                    key={similarProduct.id}
              onClick={() => {
                if (onProductClick) {
                        onProductClick(similarProduct);
                }
              }}
              className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50 relative">
                <ImageWithFallback
                        src={similarProduct.image}
                        alt={similarProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                      {discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500 text-white text-xs">
                          -{discount}%
                </Badge>
                      )}
              </div>
              <div className="p-3">
                <h4 className="text-xs sm:text-sm text-gray-900 mb-2 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                        {similarProduct.title}
                </h4>
                <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-sm sm:text-base text-primary">
                          {similarProduct.price.toLocaleString()}₮
                        </span>
                        {similarProduct.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {similarProduct.originalPrice.toLocaleString()}₮
                          </span>
                        )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                        <span>{similarProduct.sales} борлуулалт</span>
                </div>
              </div>
            </div>
                );
              })}
              </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Төстэй бүтээгдэхүүн олдсонгүй</p>
                </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50 safe-area-inset-bottom">
        <div className="px-4 py-3 sm:py-4">
          {/* Price Display - Mobile */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Нийт үнэ</span>
              <span className="text-lg sm:text-xl font-bold text-primary">
                {((displayPrice * quantity) + (storeInfo?.delivery_price || 5000)).toLocaleString()}₮
              </span>
            </div>
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
              <Button
              className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10 rounded-xl h-12 sm:h-14 transition-all active:scale-95 font-semibold"
                size="sm"
                onClick={handleAddToCart}
              >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Сагсанд</span>
              </Button>
              <Button
              className="flex-1 bg-gradient-to-r from-primary to-[#B24167] hover:from-primary/90 hover:to-[#B24167]/90 active:from-primary/80 active:to-[#B24167]/80 rounded-xl h-12 sm:h-14 shadow-lg shadow-primary/20 transition-all active:scale-95 font-semibold"
                size="sm"
                onClick={handleBuyNow}
              >
              <span className="text-sm sm:text-base">Худалдаж авах</span>
              </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={[{
          productId: product.id,
          title: product.title,
          price: displayPrice,
          image: product.colorImages[selectedVariant],
          quantity: quantity,
          variant: selectedVariant,
          optionId: selectedOption || undefined,
          storeId: product.storeId,
        }]}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}