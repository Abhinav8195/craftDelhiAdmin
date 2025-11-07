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

  const statusColors = {
    0: "#ffc600",
    1: "#69d297",
    2: "#fe0000"
  };

  const handleSelectStatus = async (index, newStatus) => {
    const token = getAdminToken();
    const productId = filteredProducts[index].id;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}admin/update-product-approval`,
        { productId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Status updated");
        reload();
      } else toast.error("Failed to update");
    } catch {
      toast.error("Error updating");
    }

    setDropdownOpen(null);
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
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-3 pr-10 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-200"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="border rounded-lg shadow overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#36234e] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <motion.tbody variants={container}>
              {filteredProducts.map((product, index) => (
                <motion.tr key={index} variants={row} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{product.id}</td>
                  <td className="px-4 py-3 truncate max-w-[160px]">{product.name}</td>
                  <td className="px-4 py-3"><img alt="" src={product.productImage} className="w-12 h-12 rounded border object-cover" /></td>
                  <td className="px-4 py-3 truncate max-w-[120px]">{product.seller}</td>

                  <td className="px-4 py-3 relative">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: statusColors[0] }}>Pending</span>

                      <button onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}>
                        <IoIosArrowDown className="text-gray-600" />
                      </button>

                      {dropdownOpen === index && (
                        <div className="absolute z-50 bg-white shadow border rounded w-28 top-9">
                          <div onClick={() => handleSelectStatus(index, 1)} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Approve</div>
                          <div onClick={() => handleSelectStatus(index, 2)} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Reject</div>
                          <div onClick={() => handleSelectStatus(index, 0)} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Pending</div>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filteredProducts.length === 0 && (
                <motion.tr><td colSpan="5" className="text-center py-6 text-gray-500">No products found</td></motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductTable;
