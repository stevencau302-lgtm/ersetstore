import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Info from './pages/Info';
import About from './pages/About';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Register from './pages/Register';
import Akun from './pages/Akun';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
