'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAdminStores, 
  getAdminProducts, 
  getAdminOrders,
  getUsers,
  AdminStore,
  AdminProduct,
  AdminOrder,
  AdminUser
} from '@/lib/admin_api';
import { Store, Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    orders: 0,
    users: 0,
    totalSales: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [storesData, productsData, ordersData, usersData] = await Promise.all([
        getAdminStores(),
        getAdminProducts(),
        getAdminOrders(),
        getUsers(),
      ]);

      // Ensure all data is arrays (handle paginated responses)
      const stores = Array.isArray(storesData) ? storesData : (storesData.results || []);
      const products = Array.isArray(productsData) ? productsData : (productsData.results || []);
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.results || []);
      const users = Array.isArray(usersData) ? usersData : (usersData.results || []);

      const totalSales = orders.reduce((sum, order) => {
        return sum + parseFloat(order.total_amount || 0);
      }, 0);

      setStats({
        stores: stores.length,
        products: products.length,
        orders: orders.length,
        users: users.length,
        totalSales,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
      title: 'Дэлгүүрүүд',
      value: stats.stores,
      icon: Store,
      color: 'bg-blue-500',
      onClick: () => router.push('/admin/stores'),
    },
    {
      title: 'Бүтээгдэхүүнүүд',
      value: stats.products,
      icon: Package,
      color: 'bg-green-500',
      onClick: () => router.push('/admin/products'),
    },
    {
      title: 'Захиалгууд',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      onClick: () => router.push('/admin/orders'),
    },
    {
      title: 'Хэрэглэгчид',
      value: stats.users,
      icon: Users,
      color: 'bg-purple-500',
      onClick: () => router.push('/admin/users'),
    },
    {
      title: 'Нийт борлуулалт',
      value: `${stats.totalSales.toLocaleString()}₮`,
      icon: DollarSign,
      color: 'bg-primary',
      onClick: () => router.push('/admin/orders'),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Хяналтын самбар</h1>
        <p className="text-gray-600 mt-2">Системийн ерөнхий мэдээлэл</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/admin/stores?action=create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Store className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Шинэ дэлгүүр</p>
          </button>
          <button
            onClick={() => router.push('/admin/products?action=create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Шинэ бүтээгдэхүүн</p>
          </button>
          <button
            onClick={() => router.push('/admin/categories?action=create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Шинэ ангилал</p>
          </button>
          <button
            onClick={() => router.push('/admin/users?action=create')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Шинэ админ</p>
          </button>
        </div>
      </div>
    </div>
  );
}

