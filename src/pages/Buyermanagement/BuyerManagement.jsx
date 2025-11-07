import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import BuyerTable from '../../components/buyerManagement/BuyerTable';
import BuyerEditProfile from '../../components/buyerManagement/BuyerEditProfile';
import { getAdminToken } from '../../utils/auth';

const BuyerManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({
    total_buyers: 0,
    active_buyers: 0,
    trashed_accounts: 0
  });
  const [loading, setLoading] = useState(true);
  const token = getAdminToken();

  const handleCardClick = (cardNumber) => {
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
  };

  useEffect(() => {
    setSelectedCard(null);

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}admin/buyer-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.status) {
          setStats(res.data.data);
        } else {
          // console.warn('API returned false status:', res.data);
        }
      } catch (err) {
        // console.error('Error fetching buyer stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    } else {
      // console.warn('No token found in localStorage');
      setLoading(false);
    }
  }, [token]);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' }
    })
  };

  return (
    <>
      {selectedCard === 1 && (
        <BuyerEditProfile card1={handleCardClick} />
      )}

      {selectedCard === null && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              icon: IconUserCheck_01,
              title: 'Total Number Of Buyers',
              value: stats.total_buyers,
              bg: 'from-[#ffe2e6]',
            }, {
              icon: IconShoppingBag_02,
              title: 'Total Number Of Active Buyers',
              value: stats.active_buyers,
              bg: 'from-[#fff4de]',
            }, {
              icon: IconFaceContent,
              title: 'Total Number Of Trashed Accounts',
              value: stats.trashed_accounts,
              bg: 'from-green-100',
            }].map((card, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className={`h-[180px] p-5 bg-gradient-to-b ${card.bg} to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between`}
              >
                <img src={card.icon} alt="Logo" className="w-10 h-10" />
                <div className="text-black text-base font-bold">{card.title}</div>
                <motion.div
                  key={loading ? 'loading' : card.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-black text-2xl font-bold"
                >
                  {loading ? '...' : card.value}
                </motion.div>
                <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <BuyerTable card1={handleCardClick} />
          </motion.div>
        </>
      )}
    </>
  );
};

export default BuyerManagement;
