const express = require('express');
const database = require('../db');
const router = express.Router();

const dashboardRouter = require('./dashboard');


router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { email } = req.query;
    
    if (!email) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(400, responseTime);
      return res.status(400).json({
        error: 'Email parameter is required',
        example: '/api/customers?email=demo@example.com'
      });
    }

    const customers = database.getCollection('customers');
    const customer = await customers.findOne({ email });

    if (!customer) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(404, responseTime);
      return res.status(404).json({
        error: 'Customer not found',
        email: email
      });
    }

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    res.json(customer);
  } catch (error) {
    console.error('Customer lookup error:', error);
    
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
    
    const customers = database.getCollection('customers');
    const customer = await customers.findOne({ _id: id });

    if (!customer) {
      const responseTime = Date.now() - startTime;
      dashboardRouter.trackAPIRequest(404, responseTime);
      return res.status(404).json({
        error: 'Customer not found',
        id: id
      });
    }

    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(200, responseTime);
    res.json(customer);
  } catch (error) {
    console.error('Customer by ID error:', error);
    
    const responseTime = Date.now() - startTime;
    dashboardRouter.trackAPIRequest(500, responseTime);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;