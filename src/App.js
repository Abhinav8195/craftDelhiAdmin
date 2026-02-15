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
import AuthCheck from './AuthCheck'
import Chat from './pages/Message/Chat';
import Banner from './pages/Banner/Banner';
import GiftCategory from './pages/Giftcategory/GiftCategory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
<>
    <AuthCheck setIsAuthenticated={setIsAuthenticated} />
    {
      isAuthenticated?  (
        <DefaultLayout setIsAuthenticated={setIsAuthenticated}>
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
</Routes>
        
        </DefaultLayout>
      ):(
        <Routes>
        <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />
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
