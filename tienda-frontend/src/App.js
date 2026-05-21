import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./views/Home";
import ProductDetail from "./views/ProductDetail";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import Cart from "./views/Cart";
import Favorites from "./views/Favorites";
import Profile from "./views/Profile";
import Orders from "./views/Orders";
import { Admin } from "./views/Admin";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname + location.search} className="page-transition">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
