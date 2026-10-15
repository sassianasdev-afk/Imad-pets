import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from 'react-toastify';
import Verify from "./pages/Verify";
import { ShopContext } from "./context/ShopContext";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SmoothFollower from "./components/SmoothFollower";
import { assets } from "./assets/frontend_assets/assets";

const App = () => {
  const { menu, setMenu, checkingAuth } = useContext(ShopContext)

  //  كنستناو حتى يكمل verifySession — بلا هاذا كيدير logout عند كل refresh
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={assets.logo} className='flex justify-between w-1/2 items-center animate-pulse' alt="" />
      </div>
    )
  }

  return (
    <div onClick={() => setMenu(false)} className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <SmoothFollower/>
      <ToastContainer  position="top-center"/>
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;