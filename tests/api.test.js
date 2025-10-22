
const request = require('supertest');

const BASE_URL = 'http://localhost:3000';

describe('API Endpoints - Live Data Tests', () => {
  
  describe('Customer API', () => {
    it('GET /api/customers?email= - should find existing customer', async () => {
      const response = await request(BASE_URL)
        .get('/api/customers?email=demo@example.com')
        .expect(200);
      
      expect(response.body.email).toBe('demo@example.com');
      expect(response.body).toHaveProperty('name');
    });

    it('GET /api/customers?email= - should return 404 for non-existent email', async () => {
      await request(BASE_URL)
        .get('/api/customers?email=this-email-does-not-exist@test.com')
        .expect(404);
    });

    it('GET /api/customers/:id - should get customer by ID', async () => {
      const response = await request(BASE_URL)
        .get('/api/customers/cust01') 
        .expect(200);
      
      expect(response.body._id).toBe('cust01');
      expect(response.body).toHaveProperty('name');
    });
  });

  describe('Products API', () => {
    it('GET /api/products - should return products array', async () => {
      const response = await request(BASE_URL)
        .get('/api/products?limit=5')
        .expect(200);
      
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    it('GET /api/products/:id - should return product details', async () => {
      const response = await request(BASE_URL)
        .get('/api/products/p03') 
        .expect(200);
      
      expect(response.body._id).toBe('p03');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('GET /api/products?search= - should filter products by search', async () => {
      const response = await request(BASE_URL)
        .get('/api/products?search=jeans')
        .expect(200);
      
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe('Orders API', () => {
    it('GET /api/orders?customerId= - should return customer orders', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders?customerId=cust01') 
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('GET /api/orders/:id - should get order by ID', async () => {

      const ordersResponse = await request(BASE_URL)
        .get('/api/orders?customerId=cust01')
        .expect(200);
      
      if (ordersResponse.body.length > 0) {
        const orderId = ordersResponse.body[0]._id;
        
        const response = await request(BASE_URL)
          .get(`/api/orders/${orderId}`)
          .expect(200);
        
        expect(response.body._id).toBe(orderId);
        expect(response.body).toHaveProperty('status');
      }
    });

    it('POST /api/orders - should create new order', async () => {
      const orderData = {
        customerId: 'cust01', 
        items: [
          { 
            productId: 'p03', 
            name: 'Black Slim Jeans', 
            price: 45.50, 
            quantity: 1 
          }
        ],
        total: 45.50
      };

      const response = await request(BASE_URL)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      expect(response.body).toHaveProperty('orderId');
      expect(response.body.order.status).toBe('PENDING');
    });
  });

  describe('Analytics API', () => {
    it('GET /api/analytics/daily-revenue - should return revenue data', async () => {
      const response = await request(BASE_URL)
        .get('/api/analytics/daily-revenue?from=2024-01-01&to=2024-12-31')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const item = response.body[0];
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('revenue');
        expect(item).toHaveProperty('orderCount');
      }
    });

    it('GET /api/analytics/dashboard-metrics - should return metrics', async () => {
      const response = await request(BASE_URL)
        .get('/api/analytics/dashboard-metrics')
        .expect(200);
      
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('averageOrderValue');
      expect(typeof response.body.totalRevenue).toBe('number');
    });
  });

  describe('Dashboard API', () => {
    it('GET /api/dashboard/business-metrics - should return business data', async () => {
      const response = await request(BASE_URL)
        .get('/api/dashboard/business-metrics')
        .expect(200);
      
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('dailyRevenue');
      expect(response.body).toHaveProperty('totalOrders');
    });

    it('GET /api/dashboard/performance - should return performance stats', async () => {
      const response = await request(BASE_URL)
        .get('/api/dashboard/performance')
        .expect(200);
      
      expect(response.body).toHaveProperty('api');
      expect(response.body).toHaveProperty('sse');
      expect(response.body).toHaveProperty('assistant');
    });

    it('GET /api/dashboard/assistant-stats - should return assistant analytics', async () => {
      const response = await request(BASE_URL)
        .get('/api/dashboard/assistant-stats')
        .expect(200);
      
      expect(response.body).toHaveProperty('overview');
      expect(response.body).toHaveProperty('intents');
      expect(response.body).toHaveProperty('functions');
    });
  });


  
  describe('Assistant API', () => {
    it('GET /api/assistant/health - should return assistant status', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('status');
    });

    it('GET /api/assistant/test - should return test message', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/test')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('assistantAvailable');
    });

    it('GET /api/assistant/intents - should return available intents', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/intents')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('intents');
      expect(Array.isArray(response.body.data.intents)).toBe(true);
      

      const expectedIntents = ['policy_question', 'order_status', 'product_search', 'complaint', 'chitchat', 'off_topic', 'violation'];
      expectedIntents.forEach(intent => {
        expect(response.body.data.intents).toContain(intent);
      });
    });

    it('POST /api/assistant/generate - should process message (if assistant available)', async () => {
      const testMessage = {
        message: "Hello, what's your return policy?",
        context: {}
      };

      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send(testMessage);


      if (response.status === 503) {
    
        expect(response.body).toHaveProperty('error');
        console.log('ℹ️ Assistant not available (expected for some setups)');
      } else {

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('text');
        expect(response.body.data).toHaveProperty('intent');
        
 
        const responseText = response.body.data.text.toLowerCase();
        expect(responseText).not.toMatch(/chatgpt|llama|ai language model|openai|meta/i);
      }
    });

    it('POST /api/assistant/generate - should return 400 for invalid message', async () => {
      const invalidMessage = {

        context: {}
      };

      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send(invalidMessage)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('SSE Endpoints', () => {
    it('GET /api/orders/:id/stream - should return SSE headers', async () => {
      const orderData = {
        customerId: 'cust01', 
        items: [
          { 
            productId: 'p03', 
            name: 'SSE Test Product', 
            price: 1.00, 
            quantity: 1 
          }
        ],
        total: 1.00
      };

      const orderResponse = await request(BASE_URL)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      const orderId = orderResponse.body.orderId;

      // Test SSE endpoint
      const response = await request(BASE_URL)
        .get(`/api/orders/${orderId}/stream`)
        .expect(200);
      
      // Should have SSE headers
      expect(response.headers['content-type']).toContain('text/event-stream');
      expect(response.headers['cache-control']).toContain('no-cache');
      expect(response.headers['connection']).toBe('keep-alive');
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(BASE_URL)
        .get('/api/nonexistent-route')
        .expect(404);
    });

    it('should return 400 for invalid order data', async () => {
      const invalidOrder = { 
        items: [] // Missing required fields
      };
      
      await request(BASE_URL)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);
    });
  });
});