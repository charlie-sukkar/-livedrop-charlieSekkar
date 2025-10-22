const express = require('express');
const database = require('../db');
const router = express.Router();

// Import dashboard routes to access tracking functions
const dashboardRouter = require('./dashboard');

// POST /api/orders
router.post('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { customerId, items, carrier = 'Aramex' } = req.body;

    // Validation
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['customerId', 'items']
      });
    }

    // Validate customer exists
    const customers = database.getCollection('customers');
    const customer = await customers.findOne({ _id: customerId });
    if (!customer) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(404, responseTime);
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    // Validate products and calculate total
    const products = database.getCollection('products');
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await products.findOne({ _id: item.productId });
      if (!product) {
        const responseTime = Date.now() - startTime;
        dashboardRouter.trackAPIRequest(404, responseTime);
        return res.status(404).json({
          error: `Product not found: ${item.productId}`
        });
      }

      if (product.stock < item.quantity) {
        const responseTime = Date.now() - startTime;
        dashboardRouter.trackAPIRequest(400, responseTime);
        return res.status(400).json({
          error: 'Insufficient stock',
          productId: product._id,           
          productName: product.name,        
          available: product.stock,
          requested: item.quantity
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

  
    const orders = database.getCollection('orders');
    const newOrder = {
      _id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
      customerId,
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      status: 'PENDING',
      carrier,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await orders.insertOne(newOrder);

   
    for (const item of items) {
      await products.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(201, responseTime);
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

router.get('/:id', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    const orders = database.getCollection('orders');
    const order = await orders.findOne({ _id: id });

    if (!order) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(404, responseTime);
      return res.status(404).json({
        error: 'Order not found',
        id: id
      });
    }

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    res.json(order);
  } catch (error) {
    console.error('Order by ID error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { customerId } = req.query;
    
    if (!customerId) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'customerId parameter is required',
        example: '/api/orders?customerId=cust01'
      });
    }

    const orders = database.getCollection('orders');
    const customerOrders = await orders.find({ customerId })
      .sort({ createdAt: -1 })
      .toArray();

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    res.json(customerOrders);
  } catch (error) {
    console.error('Customer orders error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;