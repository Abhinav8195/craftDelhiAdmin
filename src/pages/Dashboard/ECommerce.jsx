import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import PendingApproval from './PendingApproval';
import TotalRevenue from './TotalRevenue';
import TotalUsers from './TotalUsers';
import UserTable from '../../components/DashBoardData/UserTable';
import ProductTable from '../../components/DashBoardData/ProductTable';
import RevenueTable from '../../components/DashBoardData/RevenueTable';
import { getAdminToken } from '../../utils/auth';

const ECommerce = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
  total_revenue: 0,
  current_month_revenue: 0
});

const [userFilter, setUserFilter] = useState('all');

  const handleCardClick = (cardNumber, filter = 'all') => {
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
    setUserFilter(filter);
  };


  useEffect(() => {   
    setSelectedCard(null);
  }, []); 

  const token = getAdminToken();


  const fetchStats = useCallback(async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/admin/dashboard-stats`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data?.status) setStats(response.data.data);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  }
}, [token]); 

  const fetchProducts = useCallback(async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/admin/products-view`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const filtered = response.data.data
        .filter(product => product.admin_approval === 0)
        .map(product => ({
          id: product.id,
          name: product.product_name,
          productImage: product.main_image_url,
          seller: `${product.first_name || ''} ${product.last_name || ''}`.trim(),
          status: 'Pending'
        }));
      setProducts(filtered);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}, [token]);


  const fetchRevenueStats = useCallback(async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/admin/revenue-stats`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setRevenueStats(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
  }
}, [token]);


  useEffect(() => {
  fetchStats();
  fetchProducts();
  fetchRevenueStats();
}, [fetchStats, fetchProducts, fetchRevenueStats]); 

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-30px]">
      {selectedCard === 1 && (
        <>
          <UserTable card1={handleCardClick} stats={stats} filter={userFilter}/>
        </>
      )}
      {selectedCard === 2 && (
        <>
          <ProductTable card1={handleCardClick} products={products} reload={fetchProducts}/>
        </>
      )}
      {selectedCard === 3 && (
        <>
          <RevenueTable revenue={revenueStats} card1={handleCardClick} />
        </>
      )}
      {selectedCard === null && (
        <>
          <TotalUsers card1={handleCardClick} stats={stats} />
          <PendingApproval card1={handleCardClick} products={products}/>
          <TotalRevenue card1={handleCardClick} revenue={revenueStats} />
        </>
      )}
    </div>
  );
};

export default ECommerce;