import { LayoutGrid } from "lucide-react";
import { useState } from "react";

interface Category {
  name: string;
  icon?: string;
}

export function CategoryBar() {
  const categories: Category[] = [
    { name: "Бүгд" },
    { name: "Хуанли" },
    { name: "Наалт" },
    { name: "Дижитал хэвлэл" },
    { name: "Хямдралтай" },
    { name: "Бэлгийн цуглуулга" },
    { name: "Өндөр үнэлгээтэй" },
    { name: "Шилдэг борлуулалт" },
  ];

  const [activeCategory, setActiveCategory] = useState("Бүгд");

  return (
    <div className="sticky top-[73px] z-40 md:hidden bg-white mb-3 -mx-3 px-3 py-2 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
              activeCategory === category.name
                ? "bg-primary text-white"
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
