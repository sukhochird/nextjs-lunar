'use client';

import { useState, useEffect } from "react";
import { fetchCategories, Category as ApiCategory } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryBarProps {
  onCategorySelect?: (categorySlug: string | null, categoryName: string | null) => void;
  activeCategorySlug?: string | null;
}

export function CategoryBar({ onCategorySelect, activeCategorySlug }: CategoryBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const apiCategories = await fetchCategories();
        
        if (Array.isArray(apiCategories)) {
          // Flatten categories and subcategories for the bar
          const flatCategories: Category[] = [];
          
          apiCategories.forEach((cat) => {
            flatCategories.push({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
            });
            
            // Add subcategories if they exist
            if (cat.subcategories && cat.subcategories.length > 0) {
              cat.subcategories.forEach((sub) => {
                flatCategories.push({
                  id: sub.id,
                  name: sub.name,
                  slug: sub.slug,
                });
              });
            }
          });
          
          setCategories(flatCategories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    setActiveCategory(activeCategorySlug || null);
  }, [activeCategorySlug]);

  const handleCategoryClick = (categorySlug: string | null, categoryName: string | null) => {
    setActiveCategory(categorySlug);
    if (onCategorySelect) {
      onCategorySelect(categorySlug, categoryName);
    }
  };

  if (loading) {
    return (
      <div className="sticky top-[57px] z-40 md:hidden bg-white mb-3 w-full px-4 py-2 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-400 animate-pulse">
            Ачааллаж байна...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[57px] z-40 md:hidden bg-white mb-3 w-full px-4 py-2 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {/* All Products Button */}
        <button
          onClick={() => handleCategoryClick(null, null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
            activeCategory === null
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Бүгд
        </button>
        
        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug, category.name)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeCategory === category.slug
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
