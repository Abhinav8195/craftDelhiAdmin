import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import OTPPage from './pages/OTPPage';
import CreatePassword from './pages/CreatePassword';
import ResetPassword from './pages/ResetPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
import DefaultLayout from './layout/DefaultLayout';
import ECommerce from './pages/Dashboard/ECommerce';
import TotalUsers from './components/DashBoardData/UserTable';
import BuyerManagement from './pages/Buyermanagement/BuyerManagement';
import SellerManagement from './pages/SellerManagement/SellerManagement';
import ProductManagement from './pages/Product/ProductManagement';
import OrderManagement from './pages/Order/OrderManagement';
import PaymentManagement from './pages/payment/PaymentManagement';


const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/otp" />;
};

function App() {
  const [user, setUser] = useState(true); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return user ? (
    <DefaultLayout>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <ECommerce />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/TotalUsers"
        element={
          <ProtectedRoute user={user}>
            <TotalUsers />
          </ProtectedRoute>
        }
      />
       <Route
        path="/buyer-management"
        element={
          <ProtectedRoute user={user}>
            <BuyerManagement />
          </ProtectedRoute>
        }
      />
     
      <Route
        path="/seller-management"
        element={
          <ProtectedRoute user={user}>
            <SellerManagement />
          </ProtectedRoute>
        }
      />

<Route
        path="/product-management"
        element={
          <ProtectedRoute user={user}>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-management"
        element={
          <ProtectedRoute user={user}>
            <OrderManagement />
          </ProtectedRoute>
        }
      />
       <Route
        path="//payment-management"
        element={
          <ProtectedRoute user={user}>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
    <ToastContainer />
  </DefaultLayout>
  ) : (
    <>
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/create-password" element={<CreatePassword />} />
          
        </Routes>
        <ToastContainer />
     
    </>
  );
}

export default App;
