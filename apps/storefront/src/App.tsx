import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartDrawer } from './components/organisms/CartDrawer';
import { SupportPanel } from './components/organisms/SupportPanel';
import { useCartStore, useSupportStore } from './lib/store';
import { CatalogPage } from './pages/catalog';
import { ProductPage } from './pages/product';
import { CartPage } from './pages/cart';
import { CheckoutPage } from './pages/checkout';
import { OrderStatusPage } from './pages/orderStatus';

function App() {
  const { isOpen: isCartOpen, closeCart } = useCartStore();
  const { isOpen: isSupportOpen, closeSupport } = useSupportStore();

  const drawerWidth = 400;
  const pageShift = isCartOpen || isSupportOpen ? drawerWidth : 0;

  return (
    <Router>
      <div className="relative h-screen">
        <div
          className="transition-all duration-300 ease-in-out overflow-auto"
          style={{
            marginRight: pageShift,
            maxHeight: '100vh',
          }}
        >
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/p/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderStatusPage />} />
          </Routes>
        </div>

        <div
          className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out`}
          style={{
            transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        </div>

        <div
          className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out`}
          style={{
            transform: isSupportOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <SupportPanel isOpen={isSupportOpen} onClose={closeSupport} />
        </div>
      </div>
    </Router>
  );
}

export default App;