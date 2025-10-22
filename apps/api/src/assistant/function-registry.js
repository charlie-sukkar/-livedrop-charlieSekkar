
const fetch = require('node-fetch');

class FunctionRegistry {
  constructor() {
    this.functions = new Map();
    this.apiBaseUrl = `http://localhost:${process.env.PORT || 3000}`;
    this.registerDefaultFunctions();
  }

  register(name, schema, handler) {
    this.functions.set(name, { schema, handler });
    console.log(`Registered function: ${name}`);
  }

  getAllSchemas() {
    const schemas = {};
    for (const [name, { schema }] of this.functions) {
      schemas[name] = schema;
    }
    return schemas;
  }

  async execute(name, args) {
    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Function ${name} not found`);
    }

    try {
      console.log(`Executing function: ${name} with args:`, args);
      const result = await func.handler(args);
      return {
        success: true,
        data: result,
        functionName: name
      };
    } catch (error) {
      console.error(`Function ${name} execution failed:`, error);
      return {
        success: false,
        error: error.message,
        functionName: name
      };
    }
  }

  async makeAPIRequest(endpoint, options = {}) {
    try {
      console.log(`🔍 Making API request to: ${this.apiBaseUrl}${endpoint}`);
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`🔍 API response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw new Error(`Service unavailable: ${error.message}`);
    }
  }

  registerDefaultFunctions() {
    this.register('getOrderStatus', {
      name: 'getOrderStatus',
      description: 'Get the status and details of a specific order',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: 'The order ID to look up'
          }
        },
        required: ['orderId']
      }
    }, this.getOrderStatusAPI.bind(this));


    this.register('searchProducts', {
      name: 'searchProducts',
      description: 'Search for products by query, category, or tags',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for product name, description, or category'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return',
            default: 5
          },
          category: {
            type: 'string',
            description: 'Filter by specific category'
          }
        },
        required: ['query']
      }
    }, this.searchProductsAPI.bind(this));

    this.register('getCustomerOrders', {
      name: 'getCustomerOrders',
      description: 'Get all orders for a specific customer by customer ID',
      parameters: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'Customer ID to get orders for'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of orders to return',
            default: 10
          }
        },
        required: ['customerId']
      }
    }, this.getCustomerOrdersAPI.bind(this));

  }


  async getOrderStatusAPI(args) {
    if (!args.orderId) {
      throw new Error('Order ID is required');
    }

    console.log(`🔍 Getting order status for: ${args.orderId}`);
    const order = await this.makeAPIRequest(`/api/orders/${args.orderId}`);
    
    return {
      orderId: order._id,
      status: order.status,
      total: order.total,
      items: order.items,
      estimatedDelivery: order.estimatedDelivery,
      carrier: order.carrier,
      createdAt: order.createdAt,
      customerId: order.customerId
    };
  }

  async searchProductsAPI(args) {
    if (!args.query) {
      throw new Error('Search query is required');
    }

    const params = new URLSearchParams({
      search: args.query,
      limit: Math.min(args.limit || 5, 50)
    });

    if (args.category) {
      params.append('tag', args.category);
    }

    console.log(`🔍 Searching products with: ${params.toString()}`);
    const response = await this.makeAPIRequest(`/api/products?${params.toString()}`);
    
    return {
      searchQuery: args.query,
      results: response.items.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inStock: product.stock > 0,
        stock: product.stock,
        tags: product.tags,
        imageUrl: product.imageUrl
      })),
      pagination: {
        totalResults: response.pagination.total,
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
        hasMore: response.pagination.page < response.pagination.pages
      }
    };
  }

  async getCustomerOrdersAPI(args) {
    if (!args.customerId) {
      throw new Error('Customer ID is required');
    }

    console.log(`🔍 Getting orders for customer: ${args.customerId}`);
    const ordersArray = await this.makeAPIRequest(`/api/orders?customerId=${args.customerId}`);

    const limitedOrders = ordersArray.slice(0, args.limit || 10);
    
    return {
      customerId: args.customerId,
      orders: limitedOrders.map(order => ({
        orderId: order._id,
        status: order.status,
        total: order.total,
        items: order.items,
        estimatedDelivery: order.estimatedDelivery,
        carrier: order.carrier,
        createdAt: order.createdAt
      })),
      totalOrders: ordersArray.length,
      limitedOrders: limitedOrders.length,
      message: ordersArray.length === 0 ? 'No orders found for this customer' : `Found ${ordersArray.length} orders (showing ${limitedOrders.length})`
    };
  }

}

module.exports = FunctionRegistry;