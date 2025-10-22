const express = require('express');
const database = require('../db');
const router = express.Router();
const dashboard = require('../routes/dashboard'); 


const activeConnections = new Map();


router.get('/:orderId/stream', async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`🔗 SSE Connection requested for order: ${orderId}`);

 
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });


  const connectEvent = {
    orderId, 
    message: 'SSE Connected - You will receive real-time order updates',
    timestamp: new Date().toISOString()
  };
  res.write(`event: connected\ndata: ${JSON.stringify(connectEvent)}\n\n`);
  dashboard.trackSSEConnection('connect'); 

 
  activeConnections.set(orderId, res);


  const orders = database.getCollection('orders');
  const order = await orders.findOne({ _id: orderId });

  if (!order) {
    const errorEvent = {
      error: 'Order not found',
      orderId 
    };
    res.write(`event: error\ndata: ${JSON.stringify(errorEvent)}\n\n`);
    dashboard.trackSSEConnection('event'); 
    res.end();
    activeConnections.delete(orderId);
    dashboard.trackSSEConnection('disconnect'); 
    return;
  }

  
  const initialStatus = {
    orderId: order._id,
    status: order.status,
    carrier: order.carrier,
    estimatedDelivery: order.estimatedDelivery,
    timestamp: new Date().toISOString(),
    message: `Your order is currently ${order.status.toLowerCase()}`
  };
  res.write(`event: status\ndata: ${JSON.stringify(initialStatus)}\n\n`);
  dashboard.trackSSEConnection('event'); 

  
  const statusFlow = [
    { status: 'PENDING', delay: 5000, message: 'Your order is being processed' },
    { status: 'PROCESSING', delay: 10000, message: 'Your order has been shipped' },
    { status: 'SHIPPED', delay: 15000, message: 'Your order is out for delivery' },
    { status: 'DELIVERED', delay: 20000, message: 'Your order has been delivered!' }
  ];

 
  let currentStatusIndex = statusFlow.findIndex(s => s.status === order.status);
  if (currentStatusIndex === -1) currentStatusIndex = 0;

  const sendStatusUpdate = (statusConfig) => {
    if (!activeConnections.has(orderId)) return;

    const update = {
      orderId: order._id,
      status: statusConfig.status,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery,
      timestamp: new Date().toISOString(),
      message: statusConfig.message
    };

    console.log(`📦 Sending status update for ${orderId}: ${statusConfig.status}`);
    
    res.write(`event: status\ndata: ${JSON.stringify(update)}\n\n`);
    dashboard.trackSSEConnection('event'); 

    orders.updateOne(
      { _id: orderId },
      { 
        $set: { 
          status: statusConfig.status,
          updatedAt: new Date()
        } 
      }
    );

    if (statusConfig.status === 'DELIVERED') {
      setTimeout(() => {
        if (activeConnections.has(orderId)) {
          const completeEvent = {
            orderId,
            message: 'Order delivery completed successfully',
            timestamp: new Date().toISOString()
          };
          res.write(`event: complete\ndata: ${JSON.stringify(completeEvent)}\n\n`);
          dashboard.trackSSEConnection('event'); 

          setTimeout(() => {
            res.end();
            activeConnections.delete(orderId);
            dashboard.trackSSEConnection('disconnect'); 
          }, 2000);
        }
      }, 3000);
    }
  };


  for (let i = currentStatusIndex; i < statusFlow.length; i++) {
    setTimeout(() => {
      if (activeConnections.has(orderId)) {
        sendStatusUpdate(statusFlow[i]);
      }
    }, statusFlow[i].delay);
  }

  req.on('close', () => {
    console.log(`🔗 SSE Disconnected for order: ${orderId}`);
    activeConnections.delete(orderId);
    dashboard.trackSSEConnection('disconnect'); 
  });


  req.on('error', (error) => {
    console.error(`❌ SSE Error for order ${orderId}:`, error);
    activeConnections.delete(orderId);
    dashboard.trackSSEConnection('error'); 
    dashboard.trackSSEConnection('disconnect'); 
  });
});

module.exports = router;