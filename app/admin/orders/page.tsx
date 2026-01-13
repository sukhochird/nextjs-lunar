'use client';

import { useEffect, useState } from 'react';
import { 
  getAdminOrders, 
  updateOrderStatus,
  AdminOrder 
} from '@/lib/admin_api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, CheckCircle2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Хүлээгдэж буй', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Баталгаажсан', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Бэлтгэж байна', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Хүргэлтэнд гарсан', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Хүргэгдсэн', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Цуцлагдсан', color: 'bg-red-100 text-red-800' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Төлөв шинэчлэхэд алдаа гарлаа');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Захиалгууд</h1>
        <p className="text-gray-600 mt-2">Захиалгын мэдээлэл удирдах</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Хайх (нэр, утас, ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Бүх төлөв</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Дэлгүүр</TableHead>
                <TableHead>Харилцагч</TableHead>
                <TableHead>Утас</TableHead>
                <TableHead>Нийт дүн</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Огноо</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Захиалга олдсонгүй
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusOption = STATUS_OPTIONS.find(s => s.value === order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.store_name}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell className="font-bold">
                        {parseFloat(order.total_amount).toLocaleString()}₮
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          className={`px-2 py-1 rounded-full text-xs border-0 ${statusOption?.color || ''}`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('mn-MN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Захиалгын дэлгэрэнгүй #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Дэлгүүр</h3>
                  <p className="text-gray-900">{selectedOrder.store_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Төлөв</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    STATUS_OPTIONS.find(s => s.value === selectedOrder.status)?.color || ''
                  }`}>
                    {selectedOrder.status_display}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Харилцагчийн нэр</h3>
                  <p className="text-gray-900">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Утасны дугаар</h3>
                  <p className="text-gray-900">{selectedOrder.customer_phone}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Хаяг</h3>
                  <p className="text-gray-900">{selectedOrder.customer_address}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Бүтээгдэхүүнүүд</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img 
                            src={item.product_image} 
                            alt={item.product_title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.product_title}</p>
                          <p className="text-sm text-gray-600">Тоо ширхэг: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold">{parseFloat(item.price).toLocaleString()}₮</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <h3 className="text-lg font-bold">Нийт дүн</h3>
                <p className="text-2xl font-bold text-primary">
                  {parseFloat(selectedOrder.total_amount).toLocaleString()}₮
                </p>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Тэмдэглэл</h3>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Хаах
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

