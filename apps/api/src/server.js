
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./db');

const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderStatusSSE = require('./sse/order-status');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');

let assistantRoutes;
try {
  assistantRoutes = require('./routes/assistant');
  console.log('Assistant routes loaded successfully');
} catch (error) {
  console.warn('Assistant routes not available:', error.message);
  assistantRoutes = express.Router();
  assistantRoutes.get('/health', (req, res) => res.json({ status: 'assistant-not-available' }));
}

const app = express();
const PORT = process.env.PORT || 3000;


// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       process.env.FRONTEND_URL,
//       'http://localhost:5173',
//       'http://localhost:3000'
//     ].filter(Boolean); 
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.log('Blocked by CORS:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      environment: process.env.NODE_ENV,
      assistant: assistantRoutes ? 'available' : 'not-available'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/orders', orderStatusSSE);
app.use('/api/dashboard', dashboardRoutes);

if (assistantRoutes) {
  app.use('/api/assistant', assistantRoutes);
  console.log('Assistant routes mounted');
} else {
  console.log('Assistant routes not available');
}

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

async function startServer() {
  try {
    await database.connect();
    const server = app.listen(PORT, () => {
      console.log(`
Server is running!
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
Database: ${database.useMock ? 'Mock' : 'Connected to MongoDB Atlas'}
Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}
      `); 
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
