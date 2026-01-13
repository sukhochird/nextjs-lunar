'use client';

import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { fetchCategories, Category as ApiCategory } from "@/lib/api";

interface Category {
  name: string;
  subcategories?: Category[];
  id?: number;
  slug?: string;
}

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to convert API category to frontend format
function convertCategory(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    subcategories: apiCategory.subcategories?.map(convertCategory) || [],
  };
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError(null);
        const apiCategories = await fetchCategories();
        
        // Ensure apiCategories is an array
        if (!Array.isArray(apiCategories)) {
          console.error('Categories response is not an array:', apiCategories);
          setError('Ангилал ачааллахад алдаа гарлаа');
          setCategories([]);
          return;
        }
        
        const convertedCategories = apiCategories.map(convertCategory);
        setCategories(convertedCategories);
        
        // Auto-expand all categories with subcategories by default
        const categoriesWithSubs = convertedCategories
          .filter(cat => cat.subcategories && cat.subcategories.length > 0)
          .map(cat => cat.name);
        setExpandedCategories(categoriesWithSubs);
        
        if (convertedCategories.length > 0) {
          setActiveCategory(convertedCategories[0].name);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Ангилал ачааллахад алдаа гарлаа');
        // Fallback to empty array or default categories
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const CategoryContent = () => {
    if (loading) {
      return (
        <div className="p-4">
          <h3 className="text-gray-900 mb-4">Ангилал</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Ачааллаж байна...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <h3 className="text-gray-900 mb-4">Ангилал</h3>
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="p-4">
          <h3 className="text-gray-900 mb-4">Ангилал</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Ангилал олдсонгүй</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4">
        <h3 className="text-gray-900 mb-4">Ангилал</h3>
        <nav className="space-y-1">
          {/* All Products - Default active */}
          <button
            onClick={() => {
              router.push('/');
              onClose(); // Close sidebar on mobile after navigation
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
              pathname === '/'
                ? "bg-red-50 text-[#912F56] hover:bg-red-100"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>Бүх бүтээгдэхүүн</span>
          </button>
          
          {categories.map((category) => (
          <div key={category.id || category.name}>
            <button
              onClick={() => {
                if (category.slug) {
                  router.push(`/categories/${category.slug}`);
                  onClose(); // Close sidebar on mobile after navigation
                } else {
                  setActiveCategory(category.name);
                  toggleCategory(category.name);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                pathname === `/categories/${category.slug}`
                  ? "bg-red-50 text-[#912F56] hover:bg-red-100"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{category.name}</span>
              {category.subcategories &&
                category.subcategories.length > 0 && (
                  <>
                    {expandedCategories.includes(category.name) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </>
                )}
            </button>
            {expandedCategories.includes(category.name) &&
              category.subcategories &&
              category.subcategories.length > 0 && (
                <div className="ml-4 mt-1 mb-2 space-y-0.5 border-l-2 border-gray-100 pl-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id || sub.name}
                      onClick={() => {
                        if (sub.slug) {
                          router.push(`/categories/${sub.slug}`);
                          onClose(); // Close sidebar on mobile after navigation
                        } else {
                          setActiveCategory(sub.name);
                        }
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded transition-colors ${
                        pathname === `/categories/${sub.slug}`
                          ? "bg-red-50 text-[#912F56] hover:bg-red-100 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
          </div>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 bg-white rounded-lg shadow-sm flex-shrink-0 h-fit sticky top-24">
        <CategoryContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Ангилал</SheetTitle>
          </SheetHeader>
          <CategoryContent />
        </SheetContent>
      </Sheet>
    </>
  );
}