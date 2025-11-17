import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import OrderTable from "../../components/order/OrderTable";
import EditOrder from "../../components/order/EditOrder";
import { getAdminToken } from "../../utils/auth";

// ICONS
import { FaClipboardList } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";

const OrderManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
  });

  const token = getAdminToken();

  const handleCardClick = (cardNumber) =>
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/admin/order-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (data.status) {
          animate(0, data.data.total_orders, {
            duration: 1,
            onUpdate: (v) =>
              setStats((prev) => ({ ...prev, total_orders: Math.floor(v) })),
          });

          animate(0, data.data.pending_orders, {
            duration: 1,
            delay: 0.2,
            onUpdate: (v) =>
              setStats((prev) => ({ ...prev, pending_orders: Math.floor(v) })),
          });

          animate(0, data.data.completed_orders, {
            duration: 1,
            delay: 0.4,
            onUpdate: (v) =>
              setStats((prev) => ({ ...prev, completed_orders: Math.floor(v) })),
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchStats();
  }, []);

  // Updated Variant: No zoom, only shadow effect
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 1 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: {
      boxShadow: "0px 18px 40px rgba(0,0,0,0.20)",
      transition: { duration: 0.3 },
    },
  };

  const cardData = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      bg: "from-[#ffe2e6]",
      icon: <FaClipboardList className="text-red-500 text-4xl" />,
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      bg: "from-[#fff4de]",
      icon: <BiTimeFive className="text-yellow-600 text-4xl" />,
    },
    {
      label: "Completed Orders",
      value: stats.completed_orders,
      bg: "from-green-100",
      icon: <AiOutlineCheckCircle className="text-green-600 text-4xl" />,
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedCard === 1 ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <EditOrder card1={handleCardClick} />
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardData.map((card, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={cardVariants}
                    onClick={() => handleCardClick(1)}
                    className={`cursor-pointer h-[220px] p-5 bg-gradient-to-b ${card.bg} to-white rounded-xl border shadow-[0_6px_22px_-10px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-4 transition-all duration-300`}
                  >
                    <div>{card.icon}</div>
                    <div className="text-black text-base font-bold">{card.label}</div>
                    <motion.div className="text-black text-2xl font-bold">
                      {card.value}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Table */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-6"
              >
                <OrderTable card1={handleCardClick} />
              </motion.div>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderManagement;
