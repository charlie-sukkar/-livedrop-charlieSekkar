import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartDrawer } from './components/organisms/CartDrawer';
import { SupportPanel } from './components/organisms/SupportPanel';
import { useCartStore, useSupportStore } from './lib/store';
import { CatalogPage } from './pages/catalog';
import { ProductPage } from './pages/product';
import { CartPage } from './pages/cart';
import { CheckoutPage } from './pages/checkout';
import { OrderStatusPage } from './pages/orderStatus';
import { UserProvider, useUser } from './contexts/UserContext';
import { LoginPage } from './pages/UserLogin'; // ✅ UPDATE THIS IMPORT
import { AdminDashboard } from './pages/AdminDashboard';
import { SupportAssistantPage } from './pages/assistant';

function AppContent() {
  const { customer, isLoading } = useUser();
  const { isOpen: isCartOpen, closeCart } = useCartStore();
  const { isOpen: isSupportOpen, closeSupport } = useSupportStore();

  const drawerWidth = 400;
  const pageShift = isCartOpen || isSupportOpen ? drawerWidth : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return <LoginPage />; // ✅ USE THE NEW LOGIN PAGE
  }

  return (
    <div className="relative h-screen">

      <div
        className="transition-all duration-300 ease-in-out overflow-auto"
        style={{
          marginRight: pageShift,
          maxHeight: 'calc(100vh - 64px)',
        }}
      >
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/p/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderStatusPage />} />
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/assistant" element={<SupportAssistantPage/>}/>
        </Routes>
      </div>

      {/* Your existing cart and support panels */}
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
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;