import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Feature Pages
import { HomePage } from '../features/catalog/HomePage';
import { ProductListPage } from '../features/catalog/ProductListPage';
import { ProductDetailPage } from '../features/catalog/ProductDetailPage';
import { CartPage } from '../features/cart/CartPage';

// Auth Pages
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';

// Protected Feature Pages
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrdersListPage } from '../features/orders/OrdersListPage';
import { OrderDetailPage } from '../features/orders/OrderDetailPage';
import { ProfilePage } from '../features/account/ProfilePage';
import { AddressesPage } from '../features/account/AddressesPage';

// 404
import { NotFoundPage } from '../components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'orders',
            element: <OrdersListPage />,
          },
          {
            path: 'orders/:number',
            element: <OrderDetailPage />,
          },
          {
            path: 'account',
            element: <ProfilePage />,
          },
          {
            path: 'account/addresses',
            element: <AddressesPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
