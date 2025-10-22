// apps/storefront/src/pages/AdminDashboard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock recharts to avoid ResizeObserver issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="mock-chart">{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  Pie: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

// Mock API calls
vi.mock('../lib/api', () => ({
  getBusinessMetrics: vi.fn(() => Promise.resolve({
    totalRevenue: 10000,
    totalOrders: 150,
    totalCustomers: 89,
    averageOrderValue: 112.36,
    dailyRevenue: [],
    ordersByStatus: []
  })),
  getPerformanceMetrics: vi.fn(() => Promise.resolve({
    api: { 
      totalRequests: 1000, 
      failedRequests: 5,
      avgResponseTime: 45,
      lastUpdated: new Date().toISOString()
    },
    sse: { 
      activeConnections: 25,
      totalEventsSent: 500,
      totalErrors: 2,
      totalDisconnections: 10,
      lastUpdated: new Date().toISOString()
    },
    assistant: {
      totalQueries: 250,
      avgResponseTimePerIntent: {},
      lastUpdated: new Date().toISOString()
    }
  })),
  getAssistantStats: vi.fn(() => Promise.resolve({
    overview: { 
      totalQueries: 250, 
      totalFunctionCalls: 120,
      queriesWithFunctions: 80
    },
    intents: { 
      mostCommon: { intent: 'order_status', count: 100, percentage: '40%' },
      analytics: [],
      summary: {}
    },
    functions: { 
      mostUsed: { function: 'getOrderStatus', callCount: 60, usagePercentage: '50%' },
      analytics: [],
      summary: {}
    },
    performance: {},
    lastUpdated: new Date().toISOString()
  })),
  getSystemHealth: vi.fn(() => Promise.resolve({
    database: { 
      status: 'healthy', 
      message: 'Connected to MongoDB',
      lastChecked: new Date().toISOString()
    },
    llm: { 
      status: 'healthy', 
      message: 'LLM endpoint responsive',
      lastChecked: new Date().toISOString()
    },
    overall: 'healthy',
    lastUpdated: new Date().toISOString()
  }))
}));

// Import after mocks
import { AdminDashboard } from './AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard title and main sections', async () => {
    render(<AdminDashboard />);
    
    // Check for main title
    expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument();
    
    // Check for section headers
    expect(await screen.findByText('System Health')).toBeInTheDocument();
    expect(await screen.findByText('Business Overview')).toBeInTheDocument();
    expect(await screen.findByText('System Performance')).toBeInTheDocument();
    expect(await screen.findByText('Assistant Analytics')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('shows key metrics after loading', async () => {
    render(<AdminDashboard />);
    
    // Wait for data to load and check key metrics
    await waitFor(() => {
      expect(screen.getByText('$10000.00')).toBeInTheDocument(); // Revenue
      expect(screen.getByText('150')).toBeInTheDocument(); // Orders
      expect(screen.getByText('89')).toBeInTheDocument(); // Customers
      expect(screen.getByText('1,000')).toBeInTheDocument(); // API Requests
      expect(screen.getByText('250')).toBeInTheDocument(); // Total Queries
    });
  });

  it('displays system health status', async () => {
    render(<AdminDashboard />);
    
    // Check for system health section
    expect(await screen.findByText('System Health')).toBeInTheDocument();
    
    // Check each health card by their unique content
    expect(await screen.findByText('Database')).toBeInTheDocument();
    expect(await screen.findByText('Connected to MongoDB')).toBeInTheDocument();
    
    expect(await screen.findByText('LLM Service')).toBeInTheDocument();
    expect(await screen.findByText('LLM endpoint responsive')).toBeInTheDocument();
    
    expect(await screen.findByText('Overall System')).toBeInTheDocument();
    expect(await screen.findByText('All systems healthy')).toBeInTheDocument();
    
    // Check that "Online" appears multiple times (once per card)
    const onlineElements = await screen.findAllByText('Online');
    expect(onlineElements.length).toBe(3);
  });

  it('displays last updated time in header', async () => {
    render(<AdminDashboard />);
    
    // Use a more specific selector to target the header's last updated
    const lastUpdatedElements = await screen.findAllByText(/Last updated:/);
    expect(lastUpdatedElements.length).toBeGreaterThan(0);
    
    // The first one should be in the header
    expect(lastUpdatedElements[0]).toBeInTheDocument();
  });
});