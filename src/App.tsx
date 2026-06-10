import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Wishlist from './pages/Wishlist';
import Lacak from './pages/Lacak';
import Info from './pages/Info';
import About from './pages/About';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Register from './pages/Register';
import Akun from './pages/Akun';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminCustomers from './admin/AdminCustomers';
import AdminSettings from './admin/AdminSettings';

export default function App() {
  return (
    <Routes>
      {/* Store routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/produk" element={<Products />} />
        <Route path="/produk/:id" element={<ProductDetail />} />
        <Route path="/keranjang" element={<Cart />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/sukses" element={<Success />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/lacak" element={<Lacak />} />
        <Route path="/masuk" element={<Login />} />
        <Route path="/daftar" element={<Register />} />
        <Route path="/akun" element={
          <ProtectedRoute>
            <Akun />
          </ProtectedRoute>
        } />
        <Route path="/bantuan" element={<Info />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/halaman/:slug" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
