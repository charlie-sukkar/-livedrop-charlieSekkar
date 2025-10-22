const express = require('express');
const database = require('../db');
const router = express.Router();

const dashboardRouter = require('./dashboard');

// GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/daily-revenue', async (req, res) => {
  const startTime = Date.now(); 
  
  try {
    const { from, to } = req.query;
    
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const orders = database.getCollection('orders');

    const revenueData = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lte: toDate
          },
          status: { $in: ['DELIVERED', 'SHIPPED'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          orderCount: 1
        }
      }
    ]).toArray();

    const allDates = [];
    const currentDate = new Date(fromDate);
    
    while (currentDate <= toDate) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dailyRevenue = allDates.map(date => {
      const existingData = revenueData.find(item => item.date === date);
      
      return existingData ? {
        date: existingData.date,
        revenue: existingData.revenue,
        orderCount: existingData.orderCount
      } : {
        date: date,
        revenue: 0,
        orderCount: 0
      };
    });

    dailyRevenue.sort((a, b) => a.date.localeCompare(b.date));

    console.log('📈 Daily Revenue Analytics:', {
      dateRange: { from: fromDate.toISOString().split('T')[0], to: toDate.toISOString().split('T')[0] },
      totalDays: dailyRevenue.length,
      daysWithOrders: revenueData.length,
      daysWithZeroRevenue: dailyRevenue.length - revenueData.length
    });

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    
    res.json(dailyRevenue);
  } catch (error) {
    console.error('Daily revenue analytics error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

router.get('/dashboard-metrics', async (req, res) => {
  const startTime = Date.now(); 
  
  try {
    const orders = database.getCollection('orders');
    const customers = database.getCollection('customers');
    const products = database.getCollection('products');

    const metrics = await orders.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: { $in: ['DELIVERED', 'SHIPPED'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          totalOrders: [
            { $group: { _id: null, count: { $sum: 1 } } }
          ],
          avgOrderValue: [
            { $match: { status: { $in: ['DELIVERED', 'SHIPPED'] } } },
            { $group: { _id: null, avg: { $avg: '$total' } } }
          ],
          maxOrderValue: [
            { $match: { status: { $in: ['DELIVERED', 'SHIPPED'] } } },
            { $group: { _id: null, max: { $max: '$total' } } }
          ],
          ordersByStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          popularProducts: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.productId',
                productName: { $first: '$items.name' },
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
              }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]).toArray();

    const totalCustomers = await customers.countDocuments();

    const result = {
      totalRevenue: metrics[0]?.totalRevenue[0]?.total || 0,
      totalOrders: metrics[0]?.totalOrders[0]?.count || 0,
      totalCustomers: totalCustomers, 
      averageOrderValue: metrics[0]?.avgOrderValue[0]?.avg || 0,
      maxOrderValue: metrics[0]?.maxOrderValue[0]?.max || 0, 
      ordersByStatus: metrics[0]?.ordersByStatus || [],
      popularProducts: metrics[0]?.popularProducts || [] 
    };

    console.log('📊 Dashboard Metrics Analytics:', {
      totalRevenue: result.totalRevenue,
      totalOrders: result.totalOrders,
      totalCustomers: result.totalCustomers,
      maxOrderValue: result.maxOrderValue,
      popularProductsCount: result.popularProducts.length
    });

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    
    res.json(result);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;