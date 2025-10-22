# Backend API

## 📝 Development Notes

**notes for the instructor**

### 1. Order Tracking Implementation

**Enhanced existing orderStatus.tsx from Week 4** instead of creating a new component:

- Reused the same UI with real-time SSE integration
- Maintained consistent user experience
- Added auto-status progression while keeping the original design

### 2. API Endpoint Optimization  

**Modified getCustomerOrders function** to use customerId instead of email Leveraged existing `/api/orders?customerId=:customerId` endpoint

### Two Assistant Implementations

1. **Help Button (Header)** - **Smart Assistant**
   - Full Week 5 intelligent assistant
   - Intent detection + function calling
   - Real API integration
   - Personality: "Lin" - Support Specialist

2. **Drawer Assistant** - **Week 4 Basic Assistant**
   - Kept as reference from previous week
   - Simple mock responses
   - No intent detection or API calls
   - Demonstrates progression from Week 4 to Week 5

## Quick Start

```bash
cd apps/api
npm install
cp .env.example .env
npm run dev
 ```

 Seeds database with:
20-30 products
10-15 customers (including [demo@example.com])
15-20 orders with various statuses

## API Endpoints  

### Customers

GET /api/customers?email=[user@example.com] - Look up customer by email

GET /api/customers/:id - Get customer profile by ID

### Products

GET /api/products - List all products with search/filter

GET /api/products/:id - Get product details

POST /api/products - Create new product (admin)

### Orders

POST /api/orders - Create new order

GET /api/orders/:id - Get order details

GET /api/orders?customerId=:customerId - Get customer orders

GET /api/orders/:id/stream - SSE stream for real-time status updates

### Analytics

GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD - Daily revenue using MongoDB aggregation

GET /api/analytics/dashboard-metrics - Business metrics

### Dashboard

GET /api/dashboard/business-metrics - Revenue, orders, average order value

GET /api/dashboard/performance - API latency, SSE connections

GET /api/dashboard/assistant-stats - Intent distribution, function calls

### Assistant

POST /api/assistant/generate - Process user messages with intent detection

## Key Features

### Real-Time Order Tracking (SSE)

- Automatic status progression: PENDING → PROCESSING → SHIPPED → DELIVERED
- Updates every 5-7 seconds for testing
- Persistent database updates
- Proper connection cleanup

### Intelligent Assistant

- **7 Intent Types:** policy_question, order_status, product_search, complaint, chitchat, off_topic, violation
- **Function Registry:** getOrderStatus(), searchProducts(), getCustomerOrders()
- **Personality:** Named assistant that never reveals AI identity
- **Knowledge Base:** 15+ store policies with citation validation

### Database Aggregation

- Daily revenue calculated using MongoDB aggregate()
- No JavaScript loops or .reduce()
- Proper date filtering and sorting

## Test User

Email: [demo@example.com]

This test user has 2-3 existing orders for testing order tracking and assistant queries.

### Testing

npm test
npm run test:api
npm run test:assistant
npm run test:integration

## Database Collections

- **Customers:** _id , name , email , phone , address , createdAt  
- **Products:** _id , name , description , price , category , tags , imageUrl , stock
- **Orders:**
  - _id , customerId , items[] , total , status , carrier ,estimatedDelivery , createdAt ,
 updatedAt
  - items : [{ productId, name, price, quantity }]
  