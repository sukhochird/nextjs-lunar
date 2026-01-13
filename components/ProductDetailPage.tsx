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
import { useCart } from "@/contexts/CartContext";
import { fetchSimilarProducts, convertProduct } from "@/lib/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckoutModal } from "./CheckoutModal";
import Slider from "react-slick";

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

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCartClick?: () => void;
  onProductClick?: (product: Product) => void;
}

export function ProductDetailPage({ product, onBack, onCartClick, onProductClick }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
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
  
  // Use selling price if available, otherwise use regular price
  const displayPrice = product.sellingPrice || product.price;

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
    addToCart({
      productId: product.id,
      title: product.title,
      price: displayPrice, // Use selling price if discount available
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
      price: displayPrice, // Use selling price if discount available
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
              <Slider ref={mainSliderRef} {...mainSliderSettings}>
                {product.colorImages.map((image, index) => (
                  <div key={index} className="aspect-square relative">
                    <ImageWithFallback
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {discount > 0 && index === selectedImage && (
                      <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-500 text-white px-3 py-1 text-sm z-10">
                        -{discount}% OFF
                      </Badge>
                    )}
                  </div>
                ))}
              </Slider>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 px-4 sm:px-6 lg:px-0">
              {product.colorImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    mainSliderRef.current?.slickGoTo(index);
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
                {discountPercentage > 0 && product.sellingPrice ? (
                  <>
                    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                      <span className="text-primary">
                        <span className="text-3xl sm:text-4xl lg:text-5xl">{product.sellingPrice.toLocaleString()}</span>
                        <span className="text-xl ml-1">₮</span>
                      </span>
                      <span className="text-gray-400 line-through text-lg sm:text-xl">
                        {product.price.toLocaleString()}₮
                      </span>
                      <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border border-red-200">
                        {discountPercentage}% хямдарсан
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Таны хэмнэлт: <span className="text-green-600">{(product.price - product.sellingPrice).toLocaleString()}₮</span>
                    </p>
                  </>
                ) : (
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="text-primary">
                      <span className="text-3xl sm:text-4xl lg:text-5xl">{product.price.toLocaleString()}</span>
                      <span className="text-xl ml-1">₮</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Merchant Info Card - NEW */}
              {storeInfo && (
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
                    {storeInfo.social.facebook && (
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
                    )}
                    {storeInfo.social.instagram && (
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
                    )}
                    {storeInfo.social.phone && (
                    <a
                      href={`tel:${storeInfo.social.phone}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-green-600/10 group-hover:bg-green-600/20 flex items-center justify-center transition-colors">
                        <Phone className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-xs">{storeInfo.social.phone}</span>
                    </a>
                    )}
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
            )}

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

            {/* Quantity Selection */}
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
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Барааны үнэ:</span>
                    <span className="text-base text-gray-900">
                      {(displayPrice * quantity).toLocaleString()}₮
                    </span>
                  </div>
                  {storeInfo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Хүргэлт:</span>
                      <span className="text-base text-gray-900">
                        {storeInfo.delivery_price.toLocaleString()}₮
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-base text-gray-700 font-semibold">Нийт үнэ:</span>
                  <span className="text-2xl sm:text-3xl text-primary font-bold">
                    {((displayPrice * quantity) + (storeInfo?.delivery_price || 5000)).toLocaleString()}₮
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
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
                {product.description ? (
                  <div 
                    className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                ) : (
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
                    {product.title} нь өндөр чанартай материалаар хийгдсэн бөгөөд таны хэрэгцээнд тохирсон төгс бүтээгдэхүүн юм. Энэхүү бүтээгдэхүүн нь дэлхийн жишигт нийцсэн бөгөөд урт хугацаанд ашиглах боломжтой.
                  </p>
                )}
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
                    <span className="text-sm lg:text-base text-gray-600">орлуулагч</span>
                    <span className="text-sm lg:text-base text-gray-900">{storeInfo?.name || 'Тодорхойгүй'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Гарал үүсэл</span>
                    <span className="text-sm lg:text-base text-gray-900">Монгол</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm lg:text-base text-gray-600">Баталга</span>
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
                  <h3 className="text-lg lg:text-xl text-gray-900">Худадан авагчийн сэтгэгдэл</h3>
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
                  ))}
                </div>
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
                        Улаанбаатар хот: 1-2 хоног<br />
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="hidden lg:flex flex-col items-center justify-center p-2 min-w-[60px] hover:bg-gray-50 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-600 mb-0.5" />
              <span className="text-[10px] text-gray-600">Холбоо барих</span>
            </button>
            <button className="hidden lg:flex flex-col items-center justify-center p-2 min-w-[60px] hover:bg-gray-50 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-gray-600 mb-0.5" />
              <span className="text-[10px] text-gray-600">Хадгалах</span>
            </button>
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
                <span className="text-xs sm:text-sm">Худадаж авах</span>
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