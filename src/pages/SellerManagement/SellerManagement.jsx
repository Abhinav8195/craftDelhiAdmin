import React, { useEffect, useState } from "react";
import axios from "axios";
import IconUserCheck_01 from "../../assets/images/IconUserCheck_01.png";
import IconShoppingBag_02 from "../../assets/images/IconShoppingBag_02.png";
import IconFaceContent from "../../assets/images/IconFaceContent.png";
import { NavLink } from "react-router-dom";
import SellerTable from "../../components/sellerManagement/SellerTable";
import SellerController from "../../components/sellerManagement/SellerController";
import { motion } from "framer-motion";
import { getAdminToken } from "../../utils/auth";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const SellerManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);
const [selectedSeller, setSelectedSeller] = useState(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_sellers: 0,
    active_sellers: 0,
    trashed_seller_accounts: 0,
  });

  const token = getAdminToken();

  const handleCardClick = (seller) => {
  setSelectedSeller(seller);
  setSelectedCard(1); 
};

  useEffect(() => {
    setSelectedCard(null);

    const fetchStats = async () => {
      try {
        setLoading(true);

        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/seller-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          res.data &&
          (res.data.status === true || res.data.success === true) &&
          res.data.data
        ) {
          const {
            total_sellers,
            active_sellers,
            trashed_seller_accounts,
          } = res.data.data;

          setStats({
            total_sellers: Number(total_sellers) || 0,
            active_sellers: Number(active_sellers) || 0,
            trashed_seller_accounts: Number(trashed_seller_accounts) || 0,
          });
        } else {
          console.warn("Unexpected API response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching seller stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      img: IconUserCheck_01,
      bg: "from-[#ffe2e6] to-white",
      title: "Total Number Of Seller's",
      value: stats.total_sellers,
    },
    {
      img: IconShoppingBag_02,
      bg: "from-[#fff4de] to-white",
      title: "Total Number Of Active Seller's",
      value: stats.active_sellers,
    },
    {
      img: IconFaceContent,
      bg: "from-green-100 to-white",
      title: "Total Number Of Trashed Account",
      value: stats.trashed_seller_accounts,
    },
  ];

  return (
    <>
      {selectedCard === 1 && (
  <SellerController
    card1={() => setSelectedCard(null)}
    seller={selectedSeller}
  />
)}

      {selectedCard === null && (
        <>
     
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <NavLink>
                  <div
                    className={`h-[180px] p-5 bg-gradient-to-b ${card.bg} rounded-xl border border-[#d9d9d9] flex flex-col justify-between items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <img src={card.img} alt="Logo" className="w-10 h-10" />
                    <div className="text-black text-base font-bold">
                      {card.title}
                    </div>
                    <motion.div
                      key={card.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-black text-2xl font-bold"
                    >
                      {loading ? "--" : card.value}
                    </motion.div>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>

 
          <div>
            <SellerTable card1={handleCardClick} />
          </div>
        </>
      )}
    </>
  );
};

export default SellerManagement;
