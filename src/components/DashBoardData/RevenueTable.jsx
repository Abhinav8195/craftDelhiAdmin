import React, { useState, useEffect } from "react";
import axios from "axios";
import IconCoins_04 from "../../assets/images/IconCoins_04.png";
import new1 from "../../assets/images/new1.png";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { getAdminToken } from "../../utils/auth";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const tableContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const tableRow = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const RevenueTable = ({ revenue, card1 }) => {
  const [revenueData, setRevenueData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [search, setSearch] = useState("");
  const token = getAdminToken();

  const fetchRevenueDetails = async (year, month = null) => {
    try {
      const params = { year };
      if (month) params.month = month;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/revenue-details`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      if (response.data.success) {
  setRevenueData(response.data.data);
  setFilteredData(response.data.data);
}
    } catch {}
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchRevenueDetails(currentYear);
  }, []);
  useEffect(() => {
  const result = revenueData.filter((item) =>
    item.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.seller_id?.toString().includes(search)
  );
  setFilteredData(result);
}, [search, revenueData]);


  return (
    <>
      {/* Page Heading */}
      <div className="text-black text-2xl font-bold font-['Montserrat'] px-4 mt-8 mb-4">
        Total Revenue
      </div>

      {/* Animated Cards */}
      <div className="px-4 mt-2">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={tableContainer}
        >
          <motion.button
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => card1(null)}
            className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border shadow flex flex-col items-center justify-between"
          >
            <img src={new1} className="w-10 h-10" alt="icon"/>
            <div className="text-black text-base font-bold">Total Revenue</div>
            <div className="text-black text-2xl font-bold">₹ {revenue.total_revenue}</div>
          </motion.button>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border shadow flex flex-col items-center justify-between"
          >
            <img src={IconCoins_04} className="w-10 h-10" alt="icon"/>
            <div className="text-black text-base font-bold">Current Month Revenue</div>
            <div className="text-black text-2xl font-bold">₹ {revenue.current_month_revenue}</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Heading + Search */}
      <div className="px-4 mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-black text-2xl font-bold font-['Montserrat']">
          Revenue Records
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[239px]">
            <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10 bg-white"
              />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <FaSearch size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Table */}
      <motion.div
        className="px-4 mt-3"
        variants={tableContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/80 backdrop-blur-md border border-[#e5e7eb] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-[#36234e] text-white uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-4 py-3 text-left">Seller ID</th>
                  <th className="px-4 py-3 text-left">Seller Name</th>
                  <th className="px-4 py-3 text-left">Total Revenue</th>
                  <th className="px-4 py-3 text-left">Year</th>
                </tr>
              </thead>

              <motion.tbody variants={tableContainer}>
               {filteredData.map((row, i) => (
                  <motion.tr
                    key={i}
                    variants={tableRow}
                    className="border-b hover:bg-gray-100 transition-all hover:shadow-sm cursor-pointer"
                  >
                    <td className="px-4 py-4 text-[12px] text-gray-700 font-medium">{row.seller_id}</td>
                    <td className="px-4 py-4 text-[12px] text-gray-700 font-medium">{row.seller_name}</td>
                    <td className="px-4 py-4 text-[12px] font-semibold text-[#024a63]">
                      ₹ {row.total_revenue?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-[12px] text-gray-500">{row.year}</td>
                  </motion.tr>
                ))}

                {revenueData.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <td colSpan="4" className="py-6 text-center text-gray-500 text-sm">
                      No revenue records found
                    </td>
                  </motion.tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RevenueTable;
