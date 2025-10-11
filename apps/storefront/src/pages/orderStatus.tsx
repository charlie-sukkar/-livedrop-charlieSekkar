import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderStatus, seedOrder } from '../lib/api';
import { OrderHeader } from '../components/molecules/OrderHeader';
import { OrderTimeline } from '../components/molecules/OrderTimeline';
import { ShippingInfo } from '../components/molecules/ShippingInfo';
import { OrderDetails } from '../components/organisms/OrderDetails';
import { OrderStatusLayout } from '../components/templates/OrderStatusLayout';
import { Button } from '../components/atoms/Button';
import { SupportButton } from '../components/molecules/SupportButton';
import { Icon } from '../components/atoms/Icon';

export const OrderStatusPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderStatus(orderId);
        
        if (orderData.status === 'NotFound') {
          setError('Order not found');
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        setError('Failed to fetch order status');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  // Demo function to simulate status updates (for development only)
  const simulateStatusUpdate = async (newStatus: 'Packed' | 'Shipped' | 'Delivered', carrier?: string, eta?: string) => {
    if (!orderId) return;
    
    try {
      seedOrder(orderId, newStatus, carrier, eta);
      const updatedOrder = await getOrderStatus(orderId);
      setOrder(updatedOrder);
      alert(`Order status updated to: ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-red-600" d="M6 18L18 6M6 6l12 12" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || `We couldn't find an order with ID: ${orderId}`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleBackToHome} variant="primary">
              Back to Home
            </Button>
          
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <OrderStatusLayout
        header={
          <OrderHeader
            orderId={orderId!}
            status={order.status}
            createdAt={order.createdAt}
          />
        }
        timeline={
          <OrderTimeline currentStatus={order.status} />
        }
        shippingInfo={
          <ShippingInfo
            carrier={order.carrier}
            eta={order.eta}
            status={order.status}
          />
        }
        orderDetails={
          <OrderDetails
            orderId={orderId!}
            status={order.status}
            createdAt={order.createdAt}
            carrier={order.carrier}
            eta={order.eta}
          />
        }
      />

      <div className="fixed bottom-6 right-6 z-40">
        <SupportButton className="shadow-lg hover:shadow-xl transition-shadow" />
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl mt-8 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            
            <Button
              variant="outline"
              size="lg"
              onClick={handleBackToHome}
              className="min-w-[200px]"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* DEMO ONLY: Status Update Controls - Remove in production */}
      {
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-sm z-50">
          <h3 className="font-semibold text-yellow-800 mb-2">Demo Controls</h3>
          <p className="text-yellow-700 text-sm mb-3">
            Update order status for testing:
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => simulateStatusUpdate('Packed')}
            >
              Mark as Packed
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => simulateStatusUpdate('Shipped', 'UPS', 'Tomorrow')}
            >
              Mark as Shipped
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => simulateStatusUpdate('Delivered')}
            >
              Mark as Delivered
            </Button>
          </div>
        </div>
      }
    </>
  );
};

export default OrderStatusPage;