import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import OrderTable from "../../components/order/OrderTable";
import EditOrder from "../../components/order/EditOrder";

const OrderManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleCardClick = (cardNumber) => {
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}admin/order-stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "craftdelhiadmin_token"
              )}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        if (data.status) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2, // stagger cards
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    }),
  };

  return (
    <>
      {selectedCard === 1 && <EditOrder card1={handleCardClick} />}

      {selectedCard === null && (
        <>
          {loading ? (
            <div className="text-center py-10">Loading stats...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Orders",
                    value: stats.total_orders,
                    bg: "from-[#ffe2e6]",
                  },
                  {
                    label: "Pending Orders",
                    value: stats.pending_orders,
                    bg: "from-[#fff4de]",
                  },
                  {
                    label: "Completed Orders",
                    value: stats.completed_orders,
                    bg: "from-green-100",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className={`h-[200px] p-5 bg-gradient-to-b ${card.bg} to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-center gap-[15px] text-center`}
                  >
                    <div className="text-black text-base font-bold">
                      {card.label}
                    </div>
                    <div className="text-black text-2xl font-bold">
                      {card.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 * 0.2 + 0.3, duration: 0.6 }} 
              >
                <OrderTable card1={handleCardClick} />
              </motion.div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrderManagement;
