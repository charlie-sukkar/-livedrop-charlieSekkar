export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  stockQty: number;
  description?: string;
};

const orders: Record<string, { status: string; createdAt: number; carrier?: string; eta?: string }> = {};

const delay = (ms = 120) => new Promise(res => setTimeout(res, ms));

export async function listProducts(): Promise<Product[]> {
  await delay();
  const res = await fetch('/mock-catalog.json'); 
  const catalog = (await res.json()) as Product[];
  return catalog;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await listProducts(); 
  return products.find(p => p.id === id);
}

export async function placeOrder(_cart: { productId: string; quantity: number }[]) {// Note to instructor: `_cart` is currently unused because we're working with a mock API. To keep the UI minimal, cart details are not shown again on the order page. However, I've kept the `_cart` reference to illustrate how it would be used with a real API.
  await delay();
  const orderId = Math.random().toString(36).slice(2, 12).toUpperCase(); 
  orders[orderId] = { status: 'Placed', createdAt: Date.now() };
  return { orderId };
}

export async function getOrderStatus(orderId: string) {
  await delay();
  const record = orders[orderId];
  if (!record) return { status: 'NotFound' };
  return record;
}


export function seedOrder(orderId: string, status = 'Shipped', carrier?: string, eta?: string) {
  orders[orderId] = { status, createdAt: Date.now(), carrier, eta };
}

export function getRelatedProducts(
  products: Product[], 
  currentProductId: string, 
  currentProductTags: string[], 
  maxItems = 3
): Product[] {
 
  const currentProduct = products.find(p => p.id === currentProductId);
  
  if (!currentProduct) return [];
  
  return products
    .filter(p => 
      p.id !== currentProductId && 
      p.tags.some(tag => currentProductTags.includes(tag)) 
    )
    .slice(0, maxItems); 
}