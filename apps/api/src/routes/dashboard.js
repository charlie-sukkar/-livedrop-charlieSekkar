const express = require('express');
const database = require('../db');
const router = express.Router();

const metrics = {
  sse: {
    connections: 0,
    eventsSent: 0,
    errors: 0,
    disconnections: 0,
    lastUpdated: new Date()
  },
  api: {
    totalRequests: 0,
    failedRequests: 0,
    responseTimes: [],
    lastUpdated: new Date()
  },
  assistant: {
    totalQueries: 0,
    intents: {},
    functionCalls: {},
    responseTimes: {},
    lastUpdated: new Date()
  },
  // NEW: System health tracking
  system: {
    database: { status: 'unknown', message: 'Not checked', lastChecked: null },
    llm: { status: 'unknown', message: 'Not checked', lastChecked: null },
    lastUpdated: new Date()
  }
};

// Add this function to check LLM connection
async function checkLLMConnection() {
  try {
    if (!process.env.COLAB_LLM_ENDPOINT || process.env.COLAB_LLM_ENDPOINT === 'your_ngrok_url_here/generate') {
      return { status: 'unknown', message: 'LLM endpoint not configured' };
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(process.env.COLAB_LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'ping' }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      return { status: 'healthy', message: 'LLM endpoint responsive' };
    } else {
      return { status: 'unhealthy', message: `LLM endpoint returned ${response.status}` };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { status: 'unhealthy', message: 'LLM endpoint timeout (10s)' };
    }
    return { status: 'unhealthy', message: `LLM endpoint unreachable: ${error.message}` };
  }
}

// Add this function to update system health
async function updateSystemHealth() {
  try {
    const [dbHealth, llmHealth] = await Promise.all([
      database.healthCheck(),
      checkLLMConnection()
    ]);
    
    metrics.system.database = { ...dbHealth, lastChecked: new Date() };
    metrics.system.llm = { ...llmHealth, lastChecked: new Date() };
    metrics.system.lastUpdated = new Date();
    
    // Calculate overall system health
    const criticalServices = [dbHealth.status, llmHealth.status];
    if (criticalServices.includes('unhealthy')) {
      metrics.system.overall = 'degraded';
    } else if (criticalServices.every(status => status === 'healthy')) {
      metrics.system.overall = 'healthy';
    } else {
      metrics.system.overall = 'unknown';
    }
    
  } catch (error) {
    metrics.system.database = { status: 'unknown', message: 'Health check failed', lastChecked: new Date() };
    metrics.system.llm = { status: 'unknown', message: 'Health check failed', lastChecked: new Date() };
    metrics.system.overall = 'unhealthy';
    metrics.system.lastUpdated = new Date();
  }
}


setInterval(updateSystemHealth, 30000);

updateSystemHealth();

router.metrics = metrics;


router.trackSSEConnection = (type) => {
  console.log(`📊 SSE Tracking: ${type}`);
  
  if (type === 'connect') metrics.sse.connections++;
  else if (type === 'disconnect') {
    metrics.sse.connections = Math.max(0, metrics.sse.connections - 1);
    metrics.sse.disconnections++;
  }
  else if (type === 'event') metrics.sse.eventsSent++;
  else if (type === 'error') metrics.sse.errors++;

  metrics.sse.lastUpdated = new Date();
};

router.trackAPIRequest = (statusCode, responseTime) => {
  metrics.api.totalRequests++;
  metrics.api.responseTimes.push(responseTime);

  if (metrics.api.responseTimes.length > 1000)
    metrics.api.responseTimes = metrics.api.responseTimes.slice(-1000);

  if (statusCode >= 400) metrics.api.failedRequests++;

  metrics.api.lastUpdated = new Date();
};

router.trackAssistantQuery = (intent, functionCalls, responseTime) => {
  metrics.assistant.totalQueries++;
  metrics.assistant.intents[intent] = (metrics.assistant.intents[intent] || 0) + 1;

  const calls = Array.isArray(functionCalls) ? functionCalls : 
               (functionCalls ? [functionCalls] : []);

  if (calls.length > 0) {
    calls.forEach(func => {
      metrics.assistant.functionCalls[func] = (metrics.assistant.functionCalls[func] || 0) + 1;
    });
  }

  if (!metrics.assistant.responseTimes[intent]) {
    metrics.assistant.responseTimes[intent] = [];
  }
  metrics.assistant.responseTimes[intent].push(responseTime);

  if (metrics.assistant.responseTimes[intent].length > 100) {
    metrics.assistant.responseTimes[intent] = metrics.assistant.responseTimes[intent].slice(-100);
  }

  metrics.assistant.lastUpdated = new Date();
};


router.get('/business-metrics', async (req, res) => {
  console.log('=== DASHBOARD BUSINESS METRICS START ===');
  
  try {
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = new Date().toISOString().split('T')[0];
    
    console.log('1. Calling analytics with dates:', { from, to });
    
    let dailyRevenue = [];
    
    const dailyRevenueResponse = await fetch(`http://localhost:3000/api/analytics/daily-revenue?from=${from}&to=${to}`);
    
    console.log('2. Analytics response status:', dailyRevenueResponse.status);
    console.log('3. Analytics response ok:', dailyRevenueResponse.ok);
    
    if (dailyRevenueResponse.ok) {
      const responseText = await dailyRevenueResponse.text();
      console.log('4. Response text length:', responseText.length);
      console.log('5. Response text:', responseText);
      
      if (responseText && responseText.trim()) {
        dailyRevenue = JSON.parse(responseText);
        console.log('6. Parsed daily revenue length:', dailyRevenue.length);
      }
    }
    
    let dashboardMetrics = {};
    const dashboardMetricsResponse = await fetch('http://localhost:3000/api/analytics/dashboard-metrics');
    
    if (dashboardMetricsResponse.ok) {
      dashboardMetrics = await dashboardMetricsResponse.json();
      console.log('7. Business metrics received');
    }
    

    const result = {
      dailyRevenue: dailyRevenue,
      totalRevenue: dashboardMetrics.totalRevenue || 0,
      totalOrders: dashboardMetrics.totalOrders || 0,
      totalCustomers: dashboardMetrics.totalCustomers || 0,
      averageOrderValue: dashboardMetrics.averageOrderValue || dashboardMetrics.avgOrderValue || 0,
      maxOrderValue: dashboardMetrics.maxOrderValue || 0,
      ordersByStatus: dashboardMetrics.ordersByStatus || [],
      popularProducts: dashboardMetrics.popularProducts || []
    };
    
    console.log('8. Final result - dailyRevenue length:', result.dailyRevenue.length);
    console.log('=== DASHBOARD BUSINESS METRICS END ===');
    
    res.json(result);
    
  } catch (error) {
    console.error('DASHBOARD ERROR:', error);
    res.json({
      dailyRevenue: [],
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      maxOrderValue: 0,
      ordersByStatus: [],
      popularProducts: []
    });
  }
});

// Your existing performance route remains the same...
router.get('/performance', (req, res) => {
  const avgApiResponseTime = metrics.api.responseTimes.length
    ? metrics.api.responseTimes.reduce((a, b) => a + b, 0) / metrics.api.responseTimes.length
    : 0;

  const avgResponseTimePerIntent = {};
  for (const intent in metrics.assistant.responseTimes) {
    const times = metrics.assistant.responseTimes[intent];
    avgResponseTimePerIntent[intent] = times.length
      ? times.reduce((a, b) => a + b, 0) / times.length
      : 0;
  }

  res.json({
    api: {
      totalRequests: metrics.api.totalRequests,
      failedRequests: metrics.api.failedRequests,
      avgResponseTime: avgApiResponseTime,
      lastUpdated: metrics.api.lastUpdated
    },
    sse: {
      activeConnections: metrics.sse.connections,
      totalEventsSent: metrics.sse.eventsSent,
      totalErrors: metrics.sse.errors,
      totalDisconnections: metrics.sse.disconnections,
      lastUpdated: metrics.sse.lastUpdated
    },
    assistant: {
      totalQueries: metrics.assistant.totalQueries,
      avgResponseTimePerIntent,
      lastUpdated: metrics.assistant.lastUpdated
    }
  });
});

// Your existing assistant-stats route remains the same...
router.get('/assistant-stats', (req, res) => {
  const intents = metrics.assistant.intents;
  const functionCalls = metrics.assistant.functionCalls;
  const totalQueries = metrics.assistant.totalQueries;

  const intentAnalytics = Object.entries(intents).map(([intent, count]) => ({
    intent,
    count,
    percentage: totalQueries > 0 ? ((count / totalQueries) * 100).toFixed(1) + '%' : '0%'
  })).sort((a, b) => b.count - a.count);

  const functionAnalytics = Object.entries(functionCalls).map(([func, count]) => ({
    function: func,
    callCount: count,
    usagePercentage: totalQueries > 0 ? ((count / totalQueries) * 100).toFixed(1) + '%' : '0%'
  })).sort((a, b) => b.callCount - a.callCount);

  const responseTimeAnalytics = {};
  Object.entries(metrics.assistant.responseTimes).forEach(([intent, times]) => {
    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      responseTimeAnalytics[intent] = {
        averageTime: Math.round(avgTime),
        sampleSize: times.length
      };
    }
  });

  res.json({
    overview: {
      totalQueries,
      totalFunctionCalls: Object.values(functionCalls).reduce((sum, count) => sum + count, 0),
      queriesWithFunctions: functionAnalytics.reduce((sum, func) => sum + func.callCount, 0)
    },
    intents: {
      summary: metrics.assistant.intents,
      analytics: intentAnalytics,
      mostCommon: intentAnalytics[0] || null
    },
    functions: {
      summary: metrics.assistant.functionCalls,
      analytics: functionAnalytics,
      mostUsed: functionAnalytics[0] || null
    },
    performance: responseTimeAnalytics,
    lastUpdated: metrics.assistant.lastUpdated
  });
});

// NEW: Add system health endpoint
router.get('/system-health', (req, res) => {
  res.json({
    database: metrics.system.database,
    llm: metrics.system.llm,
    overall: metrics.system.overall || 'unknown',
    lastUpdated: metrics.system.lastUpdated
  });
});

module.exports.metrics = metrics;
module.exports = router;