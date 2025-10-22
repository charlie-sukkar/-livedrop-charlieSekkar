// ✅ ADD THIS ONE LINE AT THE TOP
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface OrderStatusEvent {
  orderId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  carrier: string;
  estimatedDelivery: string;
  timestamp: string;
  message: string;
}

export interface SSEHandlers {
  onStatusUpdate: (data: OrderStatusEvent) => void;
  onComplete?: () => void;
  onError?: (error: Error | Event) => void;
  onReconnect?: () => void;
  onMessage?: (data: any) => void;
}

export class OrderSSEClient {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 3000;
  private orderId: string;
  private handlers: SSEHandlers;
  private shouldReconnect = true;

  constructor(orderId: string, handlers: SSEHandlers) {
    this.orderId = orderId;
    this.handlers = handlers;
  }

  connect(): void {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      // ✅ CHANGED: Use API_BASE_URL instead of hardcoded URL
      const url = `${API_BASE_URL}/api/orders/${this.orderId}/stream`;
      console.log('Connecting to SSE:', url);
      
      this.eventSource = new EventSource(url);
      
      this.eventSource.onopen = () => {
        console.log('SSE connected');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE message:', data);
          if (this.handlers.onMessage) {
            this.handlers.onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        if (this.handlers.onError) {
          this.handlers.onError(error);
        }
        if (this.shouldReconnect) {
          this.handleReconnection();
        }
      };

      this.eventSource.addEventListener('status', (event: MessageEvent) => {
        try {
          const data: OrderStatusEvent = JSON.parse(event.data);
          console.log('Status update:', data);
          this.handlers.onStatusUpdate(data);
          
          if (data.status === 'DELIVERED') {
            console.log('Order delivered, stopping reconnection');
            this.shouldReconnect = false;
          }
        } catch (error) {
          console.error('Error parsing status event:', error);
        }
      });

      this.eventSource.addEventListener('complete', (_event: MessageEvent) => {
        console.log('Order delivery complete');
        this.shouldReconnect = false;
        
        if (this.handlers.onComplete) {
          this.handlers.onComplete();
          
        }
        this.disconnect();
      });

      this.eventSource.addEventListener('error', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.error('Server error event:', data);
          if (this.handlers.onError) {
            this.handlers.onError(new Error(data.message || 'Server error'));
          }
        } catch (error) {
          console.error('Error parsing error event:', error);
        }
      });

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      if (this.shouldReconnect) {
        this.handleReconnection();
      }
    }
  }

  private handleReconnection(): void {
    if (!this.shouldReconnect) {
      console.log('Reconnection disabled');
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        if (this.eventSource && this.eventSource.readyState === EventSource.CLOSED) {
          if (this.handlers.onReconnect) {
            this.handlers.onReconnect();
          }
          this.connect();
        }
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.disconnect();
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      console.log('Disconnecting SSE');
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected(): boolean {
    return this.eventSource ? this.eventSource.readyState === EventSource.OPEN : false;
  }
}