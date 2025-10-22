// apps/storefront/src/pages/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer
} from 'recharts';
import { getBusinessMetrics, getPerformanceMetrics, getAssistantStats, getSystemHealth } from '../lib/api';

// ✅ FIXED: Add SystemHealth interface
interface SystemHealth {
  database: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    message: string;
    lastChecked?: string;
  };
  llm: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    message: string;
    lastChecked?: string;
  };
  overall: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastUpdated: string;
}

interface BusinessMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  maxOrderValue: number;
  ordersByStatus?: any[];
  popularProducts?: any[];
  dailyRevenue?: any[];
}

interface PerformanceMetrics {
  api?: {
    totalRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    lastUpdated: string;
  };
  sse?: {
    activeConnections: number;
    totalEventsSent: number;
    totalErrors: number;
    totalDisconnections: number;
    lastUpdated: string;
  };
  assistant?: {
    totalQueries: number;
    avgResponseTimePerIntent: Record<string, number>;
    lastUpdated: string;
  };
}

interface AssistantStats {
  overview: {
    totalQueries: number;
    totalFunctionCalls: number;
    queriesWithFunctions: number;
  };
  intents: {
    summary: Record<string, number>;
    analytics: Array<{
      intent: string;
      count: number;
      percentage: string;
    }>;
    mostCommon: {
      intent: string;
      count: number;
      percentage: string;
    } | null;
  };
  functions: {
    summary: Record<string, number>;
    analytics: Array<{
      function: string;
      callCount: number;
      usagePercentage: string;
    }>;
    mostUsed: {
      function: string;
      callCount: number;
      usagePercentage: string;
    } | null;
  };
  performance: Record<string, { averageTime: number; sampleSize: number }>;
  lastUpdated: string;
}

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// ✅ FIXED: Type-safe health status system
const HEALTH_COLORS = {
  healthy: 'green',
  degraded: 'orange', 
  unhealthy: 'red',
  unknown: 'gray'
} as const;

type HealthStatus = keyof typeof HEALTH_COLORS;


// ✅ FIXED: Helper function to get health color safely
const getHealthColor = (status: HealthStatus | string): string => {
  return HEALTH_COLORS[status as HealthStatus] || 'gray';
};

// ✅ FIXED: Helper function to get health icon safely
const getHealthIcon = (status: HealthStatus | string) => {
  const healthStatus = status as HealthStatus;
  
  const icons = {
    healthy: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    unhealthy: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    degraded: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    unknown: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return icons[healthStatus] || icons.unknown;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const INTENT_COLORS = {
  'order_status': '#0088FE',
  'product_search': '#00C49F', 
  'policy_question': '#FFBB28',
  'complaint': '#FF8042',
  'chitchat': '#8884d8',
  'off_topic': '#82ca9d',
  'violation': '#ff6b6b',
  'error': '#adb5bd'
};

const FUNCTION_COLORS = {
  'getOrderStatus': '#0088FE',
  'searchProducts': '#00C49F',
  'getCustomerOrders': '#FFBB28',
  'getPolicyInfo': '#FF8042'
};

export const AdminDashboard: React.FC = () => {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [assistantStats, setAssistantStats] = useState<AssistantStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching dashboard data...');
        
        const [business, performance, assistant, health] = await Promise.all([
          getBusinessMetrics(),
          getPerformanceMetrics(),
          getAssistantStats(),
          getSystemHealth()
        ]);
        
        console.log('📊 Business Data:', business);
        console.log('⚡ Performance Data:', performance);
        console.log('🤖 Assistant Data:', assistant);
        console.log('🏥 System Health:', health);
        
        setBusinessMetrics(business);
        setPerformanceMetrics(performance);
        setAssistantStats(assistant);
        setSystemHealth(health);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Data processing
  const intentDistributionData = assistantStats?.intents?.analytics || [];
  const functionCallsData = assistantStats?.functions?.analytics || [];

  const apiRequests = performanceMetrics?.api?.totalRequests || 0;
  const failedRequests = performanceMetrics?.api?.failedRequests || 0;
  const avgResponseTime = performanceMetrics?.api?.avgResponseTime || 0;
  const sseConnections = performanceMetrics?.sse?.activeConnections || 0;
  const sseEventsSent = performanceMetrics?.sse?.totalEventsSent || 0;
  const sseErrors = performanceMetrics?.sse?.totalErrors || 0;

  const assistantTotalQueries = assistantStats?.overview?.totalQueries || 0;
  const totalFunctionCalls = assistantStats?.overview?.totalFunctionCalls || 0;
  const mostCommonIntent = assistantStats?.intents?.mostCommon;
  const mostUsedFunction = assistantStats?.functions?.mostUsed;

  const allStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const ordersByStatusData: ChartData[] = allStatuses.map(status => {
    const existing = (businessMetrics?.ordersByStatus || []).find((item: any) => item._id === status);
    return {
      name: status,
      value: existing ? existing.count : 0
    };
  });

  const responseTimeData = Object.entries(assistantStats?.performance || {}).map(([intent, data]) => ({
    intent,
    responseTime: data.averageTime,
    sampleSize: data.sampleSize
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${value}`}
      </text>
    );
  };

  // ✅ FIXED: MetricCard with health status
  const MetricCard = ({ title, value, subtitle, color = 'blue', icon, healthStatus }: any) => {
    const healthColor = healthStatus ? getHealthColor(healthStatus) : null;
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all ${
        healthStatus ? `border-${healthColor}-200` : 'border-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${
              healthStatus ? `text-${healthColor}-600` : 'text-gray-900'
            }`}>
              {value}
            </p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon && (
            <div className={`p-3 rounded-full ${
              healthStatus ? `bg-${healthColor}-100` : `bg-${color}-100`
            }`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ FIXED: Health Status Card component
  const HealthStatusCard = ({ service, data }: { service: string; data: any }) => {
    const healthColor = getHealthColor(data.status);
    const healthIcon = getHealthIcon(data.status);
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 border-${healthColor}-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 capitalize">{service}</p>
            <p className={`text-lg font-bold mt-1 text-${healthColor}-600`}>
              {data.status === 'healthy' ? 'Online' : 
               data.status === 'unhealthy' ? 'Offline' : 
               data.status === 'degraded' ? 'Degraded' : 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              {data.message}
            </p>
            {data.lastChecked && (
              <p className="text-xs text-gray-400 mt-1">
                Last checked: {new Date(data.lastChecked).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${healthColor}-100`}>
            {healthIcon}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !businessMetrics || !performanceMetrics || !assistantStats || !systemHealth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Failed to load dashboard data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overallHealthColor = getHealthColor(systemHealth.overall);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time system performance and business insights</p>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        {/* ✅ FIXED: System Health Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className={`w-1 h-6 bg-${overallHealthColor}-500 rounded-full mr-3`}></div>
            System Health
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full bg-${overallHealthColor}-100 text-${overallHealthColor}-800`}>
              {systemHealth.overall.toUpperCase()}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <HealthStatusCard service="Database" data={systemHealth.database} />
            <HealthStatusCard service="LLM Service" data={systemHealth.llm} />
            <HealthStatusCard service="Overall System" data={{ 
              status: systemHealth.overall, 
              message: `All systems ${systemHealth.overall}`,
              lastChecked: systemHealth.lastUpdated 
            }} />
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            Business Overview
          </h2>
          
          {/* Business Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Revenue" 
              value={`$${businessMetrics.totalRevenue?.toFixed(2)}`}
              subtitle="All-time revenue"
              color="blue"
            />
            <MetricCard 
              title="Total Orders" 
              value={businessMetrics.totalOrders?.toLocaleString()}
              subtitle="Completed orders"
              color="green"
            />
            <MetricCard 
              title="Total Customers" 
              value={businessMetrics.totalCustomers?.toLocaleString()}
              subtitle="Registered users"
              color="purple"
            />
            <MetricCard 
              title="Avg. Order Value" 
              value={`$${businessMetrics.averageOrderValue?.toFixed(2)}`}
              subtitle="Per order average"
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Daily Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={businessMetrics.dailyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {ordersByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
            System Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="API Requests" 
              value={apiRequests.toLocaleString()}
              subtitle={`${failedRequests} failed`}
              color="blue"
            />
            <MetricCard 
              title="Avg. Response Time" 
              value={`${avgResponseTime.toFixed(0)}ms`}
              subtitle="API performance"
              color="green"
            />
            <MetricCard 
              title="SSE Connections" 
              value={sseConnections.toString()}
              subtitle="Active connections"
              color="purple"
            />
            <MetricCard 
              title="SSE Events" 
              value={sseEventsSent.toLocaleString()}
              subtitle={`${sseErrors} errors`}
              color="orange"
            />
          </div>
        </div>

        {/* Assistant Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
            Assistant Analytics
          </h2>

          {/* Assistant Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Queries" 
              value={assistantTotalQueries.toLocaleString()}
              subtitle="All user queries"
              color="blue"
            />
            <MetricCard 
              title="Function Calls" 
              value={totalFunctionCalls.toLocaleString()}
              subtitle="Backend functions used"
              color="green"
            />
            <MetricCard 
              title="Most Common Intent" 
              value={mostCommonIntent?.intent || 'N/A'}
              subtitle={mostCommonIntent ? `${mostCommonIntent.count} queries` : 'No data'}
              color="purple"
            />
            <MetricCard 
              title="Most Used Function" 
              value={mostUsedFunction?.function || 'N/A'}
              subtitle={mostUsedFunction ? `${mostUsedFunction.callCount} calls` : 'No data'}
              color="orange"
            />
          </div>

          {/* Assistant Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Intent Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Intent Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={intentDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={renderCustomizedLabel}
                  >
                    {intentDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={INTENT_COLORS[entry.intent as keyof typeof INTENT_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value, 
                      props.payload.intent,
                      props.payload.percentage
                    ]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Function Calls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Function Calls</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={functionCallsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="function" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value, 
                      'Call Count',
                      `Usage: ${props.payload.usagePercentage}`
                    ]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="callCount" 
                    fill="#82ca9d" 
                    radius={[4, 4, 0, 0]}
                    name="Call Count"
                  >
                    {functionCallsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={FUNCTION_COLORS[entry.function as keyof typeof FUNCTION_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Response Times */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times by Intent</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="intent" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}ms`, 
                      'Avg. Response Time',
                      `Samples: ${props.payload.sampleSize}`
                    ]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="responseTime" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    name="Response Time (ms)"
                  >
                    {responseTimeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={INTENT_COLORS[entry.intent as keyof typeof INTENT_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Footer */}
        <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 bg-${overallHealthColor}-500 rounded-full mr-2`}></div>
              <span>System Status: {systemHealth.overall.toUpperCase()}</span>
            </div>
            <div>•</div>
            <div>Auto-refreshes every 30 seconds</div>
            <div>•</div>
            <div>Last updated: {lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;