import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "../../components/Product/ProductTable";
import EditProduct from "../../components/Product/EditProduct";
import { motion, animate } from "framer-motion";
import { getAdminToken } from "../../utils/auth";
import { FaBoxOpen } from "react-icons/fa";
import { TbHourglassHigh } from "react-icons/tb";

const ProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterType, setFilterType] = useState("all"); 

  const handleFilterClick = (type) => {
  setFilterType(type);
};

  const [stats, setStats] = useState({
    total_products: 0,
    pending_products: 0,
  });

  const token = getAdminToken();

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/products-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.status) {
          const d = res.data.data;

          animate(0, d.total_products || 0, {
            duration: 1,
            onUpdate: (v) =>
              setStats((prev) => ({ ...prev, total_products: Math.floor(v) })),
          });

          animate(0, d.pending_products || 0, {
            duration: 1,
            delay: 0.2,
            onUpdate: (v) =>
              setStats((prev) => ({ ...prev, pending_products: Math.floor(v) })),
          });
        }
      } catch (error) {
        console.error("Error fetching product stats:", error);
      }
    };

    fetchProductStats();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 1 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 90,
        damping: 12,
      },
    }),
    hover: {
      boxShadow: "0px 18px 40px rgba(0,0,0,0.20)",
      transition: { duration: 0.3 },
    },
  };

  const cardItems = [
    { label: "Total Products", value: stats.total_products,type: "all", bg: "from-[#ffe2e6]", icon: <FaBoxOpen className="text-red-500 text-4xl" /> },
    { label: "Pending Products", value: stats.pending_products,type: "pending", bg: "from-[#fff4de]", icon: <TbHourglassHigh className="text-yellow-600 text-4xl" /> },
  ];

  return (
    <>
      {/* Show edit page when a product is selected */}
      {selectedProduct && <EditProduct product={selectedProduct} card1={() => setSelectedProduct(null)} />}

      {!selectedProduct && (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cardItems.map((card, i) => (
              <motion.div
                key={i}
                onClick={() => handleFilterClick(card.type)}
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
                className={`cursor-pointer h-[200px] p-5 bg-gradient-to-b ${card.bg} to-white rounded-xl border border-[#d9d9d9]
                flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.2)]`}
              >
                {card.icon}
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
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6"
          >
            <ProductTable card1={handleCardClick} filterType={filterType} />
          </motion.div>
        </>
      )}
    </>
  );
};

export default ProductManagement;
