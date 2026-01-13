import { Home, LayoutGrid, Store, ShoppingCart, User } from "lucide-react";
import { Badge } from "./ui/badge";

type NavTab = 'home' | 'categories' | 'stores' | 'cart' | 'profile';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  cartItemsCount?: number;
}

export function MobileBottomNav({ activeTab, onTabChange, cartItemsCount }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home' as NavTab, label: 'Нүүр', icon: Home },
    { id: 'categories' as NavTab, label: 'Ангилал', icon: LayoutGrid },
    { id: 'stores' as NavTab, label: 'Дэлгүүр', icon: Store },
    { id: 'cart' as NavTab, label: 'Сагс', icon: ShoppingCart },
    { id: 'profile' as NavTab, label: 'Миний', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition-all min-w-[64px] relative ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/10' : ''}`} />
                {item.id === 'cart' && cartItemsCount !== undefined && cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
