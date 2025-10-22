import { createBrowserRouter } from 'react-router-dom';
import CatalogPage from '../pages/catalog';
import ProductPage from '../pages/product';
import CartPage from '../pages/cart';
import CheckoutPage from '../pages/checkout';
import OrderStatusPage from '../pages/orderStatus';
import SupportAssistantPage from '../pages/assistant';
import AdminDashboard from '../pages/AdminDashboard';

export const router = createBrowserRouter([
  { 
    path: '/', 
    element: <CatalogPage /> 
  },
  { 
    path: '/p/:id',
    element: <ProductPage /> 
  },
  { 
    path: '/cart', 
    element: <CartPage /> 
  },
  { 
    path: '/checkout', 
    element: <CheckoutPage /> 
  },
  { 
    path: '/order/:id',
    element: <OrderStatusPage /> 
  },
  {
    path: "/admin",
    element: <AdminDashboard/>
  }, 
  {
    path: "/assistant",
    element: <SupportAssistantPage/>
  },
]);