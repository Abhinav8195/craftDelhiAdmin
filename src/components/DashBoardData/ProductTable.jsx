import React, { useState } from 'react';
import { motion } from "framer-motion";
import IconCube_02 from '../../assets/images/IconCube_02.png';
import IconImageIndentRight from '../../assets/images/IconImageIndentRight.png';
import { IoIosArrowDown } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAdminToken } from '../../utils/auth';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const row = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};


const ProductTable = ({ card1, products, reload }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusStyle = (s) =>
    s === 1
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : s === 0
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

 const handleSelectStatus = async (index, newStatus) => {
  const product = filteredProducts[index];

  if (!product) return;

  try {
    // 👉 Reject case (future me modal laga sakta hai)
    if (newStatus === 2) {
      await updateProductStatus(product.id, 2);
    } else {
      await updateProductStatus(product.id, newStatus);
    }

  } catch (err) {
    console.error("Status update error:", err);
  } finally {
    setDropdownOpen(null);
  }
};

const updateProductStatus = async (
  productId,
  status,
  reject_reason = "",
  reject_description = ""
) => {
  const token = getAdminToken();

  try {
    await axios.put(
      `${process.env.REACT_APP_BASE_URL}admin/update-product-approval/${productId}`,
      {
        status,
        reject_reason,
        reject_description,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Status Updated");

    // 👉 best for your case (props se aa raha hai data)
    reload();

  } catch (err) {
    toast.error("Failed to update");
  }
};

  return (
    <motion.div className="md:px-1 mt-8" initial="hidden" animate="visible" variants={container}>

      <div className="text-black text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
        Pending Approvals
      </div>

       <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          variants={cardVariants}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => card1(null)}
          className="w-full"
        >
          <div className="h-[180px] p-4 bg-gradient-to-b from-[#ffeaea] to-white rounded-2xl border border-[#d9d9d9] shadow flex flex-col items-center justify-between">
            <img src={IconCube_02} alt="" className="w-10 h-10" />
            <div className="text-black text-base font-semibold text-center">Products Pending Approval</div>
            <div className="text-black text-3xl font-bold">{products.length}</div>
          </div>
        </motion.button>

        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
          className="h-[180px] p-4 bg-gradient-to-b from-[#ffeaea] to-white rounded-2xl border border-[#d9d9d9] shadow flex flex-col items-center justify-between"
        >
          <img src={IconImageIndentRight} alt="" className="w-10 h-10" />
          <div className="text-black text-base font-semibold text-center">Products Pending Actions</div>
          <div className="text-black text-3xl font-bold">{products.length}</div>
        </motion.div>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-black">Products Pending Approval</h2>
        <div className="relative w-full sm:w-[260px]">
          <input
            placeholder="Search pending products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
          />
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-100 rounded-2xl shadow-xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#36234e] text-white">
              <tr>
                <th className="px-5 py-4 font-bold text-xs uppercase tracking-widest">ID</th>
                <th className="px-5 py-4 font-bold text-xs uppercase tracking-widest">Product</th>
                <th className="px-5 py-4 font-bold text-xs uppercase tracking-widest">Image</th>
                <th className="px-5 py-4 font-bold text-xs uppercase tracking-widest">Seller</th>
                <th className="px-5 py-4 font-bold text-xs uppercase tracking-widest w-40">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500 font-medium text-lg">
                    ✨ All caught up! No pending approvals.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.id || index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-500">{product.id}</td>
                    <td className="px-5 py-4 font-bold text-gray-900 max-w-[200px] truncate">{product.name}</td>
                    <td className="px-5 py-4">
                      <div className="relative w-12 h-12 group">
                        <img 
                          alt="" 
                          src={product.productImage} 
                          className="w-full h-full rounded-xl border border-gray-100 object-cover shadow-sm transition-transform group-hover:scale-110" 
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium max-w-[150px] truncate">{product.seller}</td>

                    <td className={`px-5 py-4 relative ${dropdownOpen === index ? "z-[50]" : ""}`}>
                      <div className="relative flex items-center gap-2 w-max">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1.5 transition-all ${statusStyle(0)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </div>

                        <div className="relative">
                          <button 
                            onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <IoIosArrowDown size={18} className="text-gray-400 hover:text-black" />
                          </button>

                          {dropdownOpen === index && (
                            <div className={`absolute right-0 w-32 bg-white border border-gray-100 shadow-2xl rounded-xl z-[100] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${
                              index >= filteredProducts.length - 2 && index > 0 ? "bottom-full mb-2" : "top-8"
                            }`}>
                              <button 
                                onClick={() => handleSelectStatus(index, 1)} 
                                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 w-full text-left flex items-center gap-2 transition-colors border-b border-gray-50"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Approve
                              </button>
                              <button 
                                onClick={() => handleSelectStatus(index, 2)} 
                                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-rose-50 hover:text-rose-700 w-full text-left flex items-center gap-2 transition-colors border-b border-gray-50"
                              >
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                Reject
                              </button>
                              <button 
                                onClick={() => handleSelectStatus(index, 0)} 
                                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-amber-50 hover:text-amber-700 w-full text-left flex items-center gap-2 transition-colors"
                              >
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Pending
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductTable;
