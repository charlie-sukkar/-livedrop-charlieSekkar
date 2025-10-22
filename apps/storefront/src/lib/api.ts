
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// export type Product = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   tags: string[];
//   stockQty: number;
//   description?: string;
// };

//const orders: Record<string, { status: string; createdAt: number; carrier?: string; eta?: string }> = {};

// const delay = (ms = 120) => new Promise(res => setTimeout(res, ms));

// export async function listProducts(): Promise<Product[]> {
//   await delay();
//   const res = await fetch('/mock-catalog.json'); 
//   const catalog = (await res.json()) as Product[];
//   return catalog;
// }

// export async function getProduct(id: string): Promise<Product | undefined> {
//   const products = await listProducts(); 
//   return products.find(p => p.id === id);
// }

// export async function placeOrder(_cart: { productId: string; quantity: number }[]) {// Note to instructor: `_cart` is currently unused because we're working with a mock API. To keep the UI minimal, cart details are not shown again on the order page. However, I've kept the `_cart` reference to illustrate how it would be used with a real API.
//   await delay();
//   const orderId = Math.random().toString(36).slice(2, 12).toUpperCase(); 
//   orders[orderId] = { status: 'Placed', createdAt: Date.now() };
//   return { orderId };
// }

// export async function getOrderStatus(orderId: string) {
//   await delay();
//   const record = orders[orderId];
//   if (!record) return { status: 'NotFound' };
//   return record;
// }


// export function seedOrder(orderId: string, status = 'Shipped', carrier?: string, eta?: string) {
//   orders[orderId] = { status, createdAt: Date.now(), carrier, eta };
// }

// export function getRelatedProducts(
//   products: Product[], 
//   currentProductId: string, 
//   currentProductTags: string[], 
//   maxItems = 3
// ): Product[] {
 
//   const currentProduct = products.find(p => p.id === currentProductId);
  
//   if (!currentProduct) return [];
  
//   return products
//     .filter(p => 
//       p.id !== currentProductId && 
//       p.tags.some(tag => currentProductTags.includes(tag)) 
//     )
//     .slice(0, maxItems); 
// }



// ==================== REAL API FUNCTIONS ====================


export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: any;
  createdAt: string;
}

export interface Order {
  _id: string;
  customerId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'NotFound';
  carrier: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;        
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string;
  stock: number;
  createdAt?: string;  
}

export interface ProductsResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  tags?: string[];
  imageUrl?: string;
  stock?: number;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export async function listProducts(searchParams?: {
  search?: string;
  tag?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  console.log('🔍 listProducts received:', searchParams);
  
  if (searchParams?.search) params.append('search', searchParams.search);
  
  if (searchParams?.tags && searchParams.tags.length > 0) {
    searchParams.tags.forEach(tag => {
      params.append('tags', tag);
    });
  }
  
  if (searchParams?.sort) params.append('sort', searchParams.sort);
  if (searchParams?.page) params.append('page', searchParams.page.toString());
  if (searchParams?.limit) params.append('limit', searchParams.limit.toString());

  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/api/products?${queryString}` : `${API_BASE_URL}/api/products`;
  
  console.log('🔍 API Call URL:', url);
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  
  return await res.json();
}
export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Product not found: ${id}`);
    }
    throw new Error(`Failed to fetch product: ${res.statusText}`);
  }
  
  return await res.json();
}

export async function createProduct(productData: CreateProductRequest): Promise<CreateProductResponse> {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create product: ${res.statusText}`);
  }
  
  return await res.json();
}

export async function getRelatedProducts(
  currentProductId: string,
  maxItems = 3
): Promise<Product[]> {
  try {

    const currentProduct = await getProduct(currentProductId);
    
    if (!currentProduct || !currentProduct.tags.length) {
      return [];
    }
    
    const allProductsResponse = await listProducts();
    const allProducts = allProductsResponse.items;
    
    const relatedProducts = allProducts
      .filter(p => 
        p._id !== currentProductId && 
        p.tags.some(tag => currentProduct.tags.includes(tag))
      )
      .slice(0, maxItems);
    
    return relatedProducts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}


export async function loginCustomer(email: string): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/customers?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Customer not found');
    }
    
    const customer = await response.json();
    return customer;
  } catch (error) {
    throw new Error('Login failed. Please check your email address.');
  }
}

export async function sendMessageToAssistant(message: string, customerEmail?: string, customerId?: string) {
  const response = await fetch(`${API_BASE_URL}/api/assistant/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context: {
        email: customerEmail,
        customerId: customerId
      }
    })
  });
  
  if (!response.ok) throw new Error('Assistant unavailable');
  return response.json();
}


export async function placeOrder(
  cart: { productId: string; quantity: number }[], 
  customerId: string
) {
  try {
    console.log('🔄 Placing order with:', { customerId, cart });
    
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        items: cart,
        carrier: 'Aramex'
      })
    });

    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response body:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Server error: ${errorText}`);
      }
      
      console.log('❌ Parsed error data:', errorData);
      
      if (errorData.error && errorData.error.includes('Insufficient stock')) {
        throw new Error(`${errorData.error}. Available: ${errorData.available}, Requested: ${errorData.requested}`);
      }
      
      throw new Error(errorData.error || 'Failed to place order');
    }

    const result = await response.json();
    console.log('✅ Order placed successfully:', result);
    
    return { 
      orderId: result.orderId || result.order._id,
      order: result.order
    };
    
  } catch (error) {
    console.error('💥 Order placement error:', error);
    throw error; 
  }
}

export async function getOrderStatus(orderId: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
  if (!response.ok) throw new Error('Order not found');
  return response.json();
}

export const getBusinessMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/business-metrics`);
    if (!response.ok) {
      console.warn('Business metrics API returned error, using defaults');
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        maxOrderValue: 0,
        ordersByStatus: [], 
        popularProducts: [],
        dailyRevenue: []
      };
    }
    const data = await response.json();
    console.log('📊 Raw Business Metrics from backend:', data);
    
   
    return data;
  } catch (error) {
    console.error('Business metrics fetch failed:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      maxOrderValue: 0,
      ordersByStatus: [], 
      popularProducts: [],
      dailyRevenue: []
    };
  }
};

export const getPerformanceMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/performance`);
    if (!response.ok) throw new Error('Failed to fetch performance metrics');
    const data = await response.json();
    console.log('⚡ Raw Performance Metrics from backend:', data);
    
    return {
      api: data.api || {
        totalRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0,
        lastUpdated: new Date()
      },
      sse: data.sse || {
        activeConnections: 0,
        totalEventsSent: 0, 
        totalErrors: 0,
        totalDisconnections: 0,
        lastUpdated: new Date()
      },
      assistant: data.assistant || {
        totalQueries: 0,
        avgResponseTimePerIntent: {},
        lastUpdated: new Date()
      }
    };
  } catch (error) {
    console.error('Performance metrics fetch failed:', error);
    return {
      api: {
        totalRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0,
        lastUpdated: new Date()
      },
      sse: {
        activeConnections: 0,
        totalEventsSent: 0,
        totalErrors: 0,
        totalDisconnections: 0,
        lastUpdated: new Date()
      },
      assistant: {
        totalQueries: 0,
        avgResponseTimePerIntent: {},
        lastUpdated: new Date()
      }
    };
  }
};

export const getAssistantStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/assistant-stats`);
    if (!response.ok) throw new Error('Failed to fetch assistant stats');
    const data = await response.json();
    console.log('🤖 Raw Assistant Stats from backend:', data);
    
    return data;
  } catch (error) {
    console.error('Assistant stats fetch failed:', error);
    return {
      overview: {
        totalQueries: 0,
        totalFunctionCalls: 0,
        queriesWithFunctions: 0
      },
      intents: {
        summary: {},
        analytics: [],
        mostCommon: null
      },
      functions: {
        summary: {},
        analytics: [],
        mostUsed: null
      },
      performance: {},
      lastUpdated: new Date()
    };
  }
};

export const getAssistantStatsSummary = async () => {
  const stats = await getAssistantStats();
  return {
    totalQueries: stats.overview?.totalQueries || 0,
    totalFunctionCalls: stats.overview?.totalFunctionCalls || 0,
    mostCommonIntent: stats.intents?.mostCommon || null,
    mostUsedFunction: stats.functions?.mostUsed || null,
    lastUpdated: stats.lastUpdated
  };
};

export const getIntentAnalytics = async () => {
  const stats = await getAssistantStats();
  return {
    analytics: stats.intents?.analytics || [],
    summary: stats.intents?.summary || {}
  };
};

export const getFunctionAnalytics = async () => {
  const stats = await getAssistantStats();
  return {
    analytics: stats.functions?.analytics || [],
    summary: stats.functions?.summary || {}
  };
};


// Add to your existing interfaces
export interface SystemHealth {
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

// Add this function to your existing API functions:
export const getSystemHealth = async (): Promise<SystemHealth> => {
  try {
    const url = `${API_BASE_URL}/api/dashboard/system-health`;
    console.log('🏥 Attempting to fetch system health from:', url);
    
    const response = await fetch(url);
    
    console.log('🏥 System Health Response Status:', response.status, response.statusText);
    
    // If endpoint doesn't exist (404), return mock data
    if (response.status === 404) {
      console.warn('❌ System health endpoint not found (404)');
      return {
        database: { status: 'unknown', message: 'Endpoint not implemented' },
        llm: { status: 'unknown', message: 'Endpoint not implemented' },
        overall: 'unknown',
        lastUpdated: new Date().toISOString()
      };
    }
    
    if (!response.ok) {
      console.error('❌ System health fetch failed:', response.statusText);
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ System Health Data Received:', data);
    return data;
  } catch (error) {
    console.error('💥 System health fetch error:', error);
    return {
      database: { status: 'unknown', message: 'Connection failed: '  },
      llm: { status: 'unknown', message: 'Connection failed: ' },
      overall: 'unknown',
      lastUpdated: new Date().toISOString()
    };
  }
};
