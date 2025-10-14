import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, Phone, MapPin, Package, LogOut, RefreshCw } from 'lucide-react';
import { fetchOrders, OrderData } from '../services/orderService';

interface AdminOrderHistoryProps {
  onLogout: () => void;
}

const AdminOrderHistory: React.FC<AdminOrderHistoryProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');

    try {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            Order History
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">Orders will appear here once customers place them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <p className="text-lg font-semibold text-gray-900">
                Total Orders: <span className="text-orange-600">{orders.length}</span>
              </p>
            </div>

            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(order.created_at)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-gray-900">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${order.customer_phone}`} className="hover:text-orange-600">
                          {order.customer_phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>{order.delivery_address}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Order Items</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {item.quantity}x Nr. {item.menuItemNumber} {item.name}
                              </p>
                              {item.selectedSize && (
                                <p className="text-sm text-gray-600">
                                  Size: {item.selectedSize.name}
                                  {item.selectedSize.description && ` - ${item.selectedSize.description}`}
                                </p>
                              )}
                              {item.selectedPastaType && (
                                <p className="text-sm text-gray-600">Pasta: {item.selectedPastaType}</p>
                              )}
                              {item.selectedSauce && (
                                <p className="text-sm text-gray-600">Sauce: {item.selectedSauce}</p>
                              )}
                              {item.selectedSideDish && (
                                <p className="text-sm text-gray-600">Side: {item.selectedSideDish}</p>
                              )}
                              {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                                <p className="text-sm text-gray-600">
                                  Ingredients: {item.selectedIngredients.join(', ')}
                                </p>
                              )}
                              {item.selectedExtras && item.selectedExtras.length > 0 && (
                                <p className="text-sm text-gray-600">Extras: {item.selectedExtras.join(', ')}</p>
                              )}
                              {item.selectedExclusions && item.selectedExclusions.length > 0 && (
                                <p className="text-sm text-gray-600">
                                  Exclusions: {item.selectedExclusions.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-orange-600">
                                {item.totalPrice.toFixed(2).replace('.', ',')} €
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {order.total_amount.toFixed(2).replace('.', ',')} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderHistory;
