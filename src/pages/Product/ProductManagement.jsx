import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ProductTable from '../../components/Product/ProductTable';
import EditProduct from '../../components/Product/EditProduct';
import { motion } from 'framer-motion';

const ProductManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({
    total_products: 0,
    pending_products: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleCardClick = (cardNumber) => {
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
  };

  const fetchProductStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('craftdelhiadmin_token');
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}admin/products-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        setStats({
          total_products: res.data.data.total_products || 0,
          pending_products: res.data.data.pending_products || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching product stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCard(null);
    fetchProductStats();
  }, []);

  return (
    <>
      {selectedCard === 1 && <EditProduct card1={handleCardClick} />}

      {selectedCard === null && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink>
                <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-center gap-[15px] items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-black text-base font-bold text-center">
                    Total Number Of Products
                  </div>
                  <div className="text-black text-2xl font-bold">
                    {loading ? '...' : stats.total_products}
                  </div>
                </div>
              </NavLink>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="h-[200px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-center gap-[15px] text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-black text-base font-bold text-center">
                  Pending Products
                </div>
                <div className="text-black text-2xl font-bold">
                  {loading ? '...' : stats.pending_products}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Fade-in table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.8 }} 
          >
            <ProductTable card1={handleCardClick} />
          </motion.div>
        </>
      )}
    </>
  );
};

export default ProductManagement;
