'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdminUser, getAdminProducts, getAdminOrders, AdminUser, AdminProduct, AdminOrder } from '@/lib/admin_api';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function StoreAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    totalSales: 0,
    pendingOrders: 0,
    loading: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, products, orders] = await Promise.all([
        getCurrentAdminUser(),
        getAdminProducts(),
        getAdminOrders(),
      ]);

      setUser(userData);

      const totalSales = orders.reduce((sum, order) => {
        return sum + parseFloat(order.total_amount);
      }, 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        products: products.length,
        orders: orders.length,
        totalSales,
        pendingOrders,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Миний бүтээгдэхүүнүүд',
      value: stats.products,
      icon: Package,
      color: 'bg-green-500',
      onClick: () => router.push('/admin/my-products'),
    },
    {
      title: 'Захиалгууд',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      onClick: () => router.push('/admin/my-orders'),
    },
    {
      title: 'Хүлээгдэж буй',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      onClick: () => router.push('/admin/my-orders?status=pending'),
    },
    {
      title: 'Нийт борлуулалт',
      value: `${stats.totalSales.toLocaleString()}₮`,
      icon: DollarSign,
      color: 'bg-primary',
      onClick: () => router.push('/admin/my-orders'),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Хяналтын самбар</h1>
        <p className="text-gray-600 mt-2">
          {user?.store_name ? `${user.store_name} - Дэлгүүрийн удирдлага` : 'Дэлгүүрийн удирдлага'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={index}
              onClick={card.onClick}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Хурдан үйлдлүүд</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/admin/my-store')}
            className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900 mb-1">Дэлгүүрийн мэдээлэл</h3>
            <p className="text-sm text-gray-600">Дэлгүүрийн мэдээлэл засах</p>
          </button>
          <button
            onClick={() => router.push('/admin/my-products?action=create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900 mb-1">Шинэ бүтээгдэхүүн</h3>
            <p className="text-sm text-gray-600">Бүтээгдэхүүн нэмэх</p>
          </button>
        </div>
      </div>
    </div>
  );
}

