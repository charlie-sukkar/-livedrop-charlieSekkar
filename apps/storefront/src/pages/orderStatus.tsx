import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../lib/api';
import { OrderHeader } from '../components/molecules/OrderHeader';
import { OrderTimeline } from '../components/molecules/OrderTimeline';
import { ShippingInfo } from '../components/molecules/ShippingInfo';
import { OrderDetails } from '../components/organisms/OrderDetails';
import { OrderStatusLayout } from '../components/templates/OrderStatusLayout';
import { Button } from '../components/atoms/Button';
import { SupportButton } from '../components/molecules/SupportButton';
import { Icon } from '../components/atoms/Icon';
import type { OrderStatusEvent } from '../lib/sse-client';
import { OrderSSEClient } from '../lib/sse-client';

const mapFromBackendStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Placed',
    'PROCESSING': 'Packed',
    'SHIPPED': 'Shipped', 
    'DELIVERED': 'Delivered',
    'NotFound': 'NotFound'
  };
  return statusMap[status] || status;
};

export const OrderStatusPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState(false);
  
  // Reference to track SSE client
  const sseClientRef = useRef<OrderSSEClient | null>(null);
  const hasOrderDataRef = useRef(false);

  // Fetch initial order data
  // Fetch initial order data
useEffect(() => {
  const fetchOrderStatus = async () => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching order:', orderId);
      
      const orderData = await getOrderStatus(orderId);
      console.log('✅ Order data received:', orderData);
      
      // ✅ FIX: Remove the 'NotFound' check since getOrderStatus throws errors
      setOrder(orderData);
      hasOrderDataRef.current = true;
      
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      // ✅ FIX: This will catch the "Order not found" error from getOrderStatus
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  fetchOrderStatus();
}, [orderId]);

// Debug: Check why SSE might not be connecting
// console.log('🔍 DEBUG - Order check:', {
//   hasOrder: !!order,
//   hasOrderId: !!orderId,
//   orderStatus: order?.status,
//   shouldConnect: !!(order && orderId && order.status !== 'DELIVERED')
// });

// Set up SSE connection when order data is available
// Set up SSE connection when order data is available
// Set up SSE connection when order data is available
useEffect(() => {
  // Don't connect if order is already delivered or no order
  if (!order || !orderId || order.status === 'DELIVERED' || order.status === 'Delivered') {
    return;
  }
  
  // Prevent multiple SSE clients
  if (sseClientRef.current) {
    return;
  }

  console.log('🎯 Setting up SSE connection for order:', orderId);

  const handlers = {
    onStatusUpdate: (data: OrderStatusEvent) => {
      console.log('🔄 SSE Status Update:', data);
      
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: mapFromBackendStatus(data.status),
        carrier: data.carrier,
        eta: data.estimatedDelivery,
      }));

      // Stop reconnecting if order is delivered
      if (data.status === 'DELIVERED') {
        console.log('✅ Order delivered, preventing future reconnections');
        if (sseClientRef.current) {
          sseClientRef.current.disconnect();
          sseClientRef.current = null;
        }
      }
    },
    
    onComplete: () => {
      console.log('🔌 SSE Connection completed');
      setSseConnected(false);
    },
    
    onError: (error: Error | Event) => {
      console.error('❌ SSE Connection error:', error);
      setSseConnected(false);
    },
    
    onReconnect: () => {
      console.log('🔄 SSE Reconnecting...');
      setSseConnected(false);
    },

    onMessage: (data: any) => {
      // Handle 'connected' event from backend
      if (data.message && data.message.includes('SSE Connected')) {
        console.log('✅ SSE Connected event received');
        setSseConnected(true);
      }
    }
  };

  try {
    sseClientRef.current = new OrderSSEClient(orderId, handlers);
    sseClientRef.current.connect();
  } catch (error) {
    console.error('❌ Failed to create SSE client:', error);
  }

  // Cleanup on unmount
  return () => {
    if (sseClientRef.current) {
      sseClientRef.current.disconnect();
      sseClientRef.current = null;
    }
    setSseConnected(false);
  };
}, [orderId, order?._id]); // ✅ Only depend on orderId and order existence
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
      {sseConnected && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded-lg text-sm z-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live updates connected
        </div>
      )}

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
    </>
  );
};

export default OrderStatusPage;