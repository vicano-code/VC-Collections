import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Products from './components/Products';
import Product from './components/Product';
import Register from "./components/Register";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Contact from './components/Contact';
import Cart from './components/Cart';
import UserAccount from './components/UserAccount';
import AdminPage from './components/AdminPage';
import AdminLogin from './components/AdminLogin';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/userAccount" element={<UserAccount />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;