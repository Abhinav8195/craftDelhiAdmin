import React, {useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import OTPPage from './pages/OTPPage';
import CreatePassword from './pages/CreatePassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './layout/DefaultLayout';
import ECommerce from './pages/Dashboard/ECommerce';
import TotalUsers from './components/DashBoardData/UserTable';
import BuyerManagement from './pages/Buyermanagement/BuyerManagement';
import SellerManagement from './pages/SellerManagement/SellerManagement';
import ProductManagement from './pages/Product/ProductManagement';
import OrderManagement from './pages/Order/OrderManagement';
import PaymentManagement from './pages/payment/PaymentManagement';
import NotFound from './pages/NotFound';
import Chat from './pages/Message/Chat';
import Banner from './pages/Banner/Banner';
import GiftCategory from './pages/Giftcategory/GiftCategory';
import Category from './pages/category/Category';

import { AuthContext } from './AuthContext';
import { useContext } from 'react';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-[#024a63] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <DefaultLayout>
        <Routes>
  <Route path="/" element={<ECommerce />} />
  <Route path="/TotalUsers" element={<TotalUsers />} />
  <Route path="/buyer-management" element={<BuyerManagement />} />
  <Route path="/seller-management" element={<SellerManagement />} />
  <Route path="/product-management" element={<ProductManagement />} />
  <Route path="/order-management" element={<OrderManagement />} />
  <Route path="/payment-management" element={<PaymentManagement />} />
   <Route path="/chat" element={<Chat />} />
    <Route path="/banner" element={<Banner />} />
    <Route path="/giftcategory" element={<GiftCategory />} />
  <Route path="/manage-categories" element={<Category />} />
</Routes>
        
        </DefaultLayout>
      ):(
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      )
    }
    <ToastContainer />
    </>
  );
}

export default App;
