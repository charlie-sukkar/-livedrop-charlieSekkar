import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
  stockQty: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId);
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            };
          } else {
            return {
              items: [...state.items, { ...item, quantity: 1 }]
            };
          }
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId)
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          )
        }));
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      openCart: () => {
        // Close support if it's open
        const supportStore = useSupportStore.getState();
        if (supportStore.isOpen) {
          supportStore.closeSupport();
        }
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

interface SupportStore {
  isOpen: boolean; 
  openSupport: () => void;
  closeSupport: () => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  isOpen: false, 
  openSupport: () => {
    // Close cart if it's open
    const cartStore = useCartStore.getState();
    if (cartStore.isOpen) {
      cartStore.closeCart();
    }
    set({ isOpen: true });
  },
  closeSupport: () => set({ isOpen: false }),
}));