'use client';

import { Star, MapPin, Users, TrendingUp, ArrowLeft, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Footer } from './Footer';
import { useState, useEffect } from 'react';
import { fetchStores, Store as ApiStore } from '@/lib/api';

interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
  tags: string[];
  description: string;
}

interface StoreListPageProps {
  onBack: () => void;
  onStoreClick: (storeId: number, storeName: string) => void;
}

// Helper function to convert API store to frontend format
function convertStore(apiStore: ApiStore): Store {
  return {
    id: apiStore.id,
    name: apiStore.name,
    image: apiStore.image || '',
    location: apiStore.location,
    tags: apiStore.badges,
    description: apiStore.description,
  };
}

export function StoreListPage({ onBack, onStoreClick }: StoreListPageProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStores({
          search: searchQuery || undefined,
          ordering: '-created_at',
        });
        const convertedStores = data.results.map(convertStore);
        setStores(convertedStores);
      } catch (err) {
        console.error('Error loading stores:', err);
        setError('Дэлгүүр ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, [searchQuery]);

  const stores_old: Store[] = [
  {
    id: 1,
    name: "Цагаан сарын цахим экспо",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Албан ёсны", "Топ 1", "Шуурхай хүргэлт"],
    description: "Календар, наалдац, дижитал хэвлэл зориулалттай дизайн"
  },
  {
    id: 2,
    name: "Creative Calendar Hub",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Албан ёсны", "Их борлуулалттай"],
    description: "Өвөрмөц дизайнтай календар, наалдац үйлдвэрлэл"
  },
  {
    id: 3,
    name: "Sticker Paradise",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Шуурхай хүргэлт", "Топ 5"],
    description: "Наалдацны томоохон сонголт, захиалгат үйлчилгээ"
  },
  {
    id: 4,
    name: "Digital Print Pro",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Албан ёсны", "Топ 1", "Захиалгат"],
    description: "Өндөр чанартай дижитал хэвлэл, захиалгат үйлчилгээ"
  },
  {
    id: 5,
    name: "Monthly Planner Store",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop",
    location: "Уланбаатар хот",
    tags: ["Шинэ", "Их борлуулалттай"],
    description: "Сар бүрийн төлөвлөгч календар, хуанли"
  },
  {
    id: 6,
    name: "Art & Design Studio",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Албан ёсны", "Захиалгат"],
    description: "Уран бүтээлч дизайн, календар болон наалдац"
  },
  {
    id: 7,
    name: "Custom Calendar Co",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Захиалгат", "Шуурхай хүргэлт"],
    description: "Захиалгат календар үйлдвэрлэл, хувийн дизайн"
  },
  {
    id: 8,
    name: "Sticker Mania",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    location: "Улаанбаатар хот",
    tags: ["Их борлуулалттай", "Топ 10"],
    description: "Өнгөт наалдац, дүрс зураг, хүүхдийн наалдац"
  }
];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        <div className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Буцах</span>
              </Button>
              <h1 className="text-gray-900">Дэлгүүрийн жагсаалт</h1>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Ачааллаж байна...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        <div className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Буцах</span>
              </Button>
              <h1 className="text-gray-900">Дэлгүүрийн жагсаалт</h1>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Буцах</span>
            </Button>
            <h1 className="text-gray-900">Дэлгүүрийн жагсаалт</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Дэлгүүр хайх..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => onStoreClick(store.id, store.name)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
            >
              {/* Store Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Tags overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {store.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      className={`text-xs ${
                        tag === "Албан ёсны"
                          ? "bg-pink-500 hover:bg-pink-500"
                          : tag.includes("Топ")
                          ? "bg-blue-600 hover:bg-blue-600"
                          : "bg-orange-500 hover:bg-orange-500"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Store Info */}
              <div className="p-3 sm:p-4">
                {/* Store Name */}
                <h3 className="text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {store.name}
                </h3>


                {/* Location */}
                <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{store.location}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2">
                  {store.description}
                </p>

                {/* Action Button */}
                <Button
                  className="w-full mt-3 bg-primary hover:bg-primary/90"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStoreClick(store.id, store.name);
                  }}
                >
                  Дэлгүүр үзэх
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}