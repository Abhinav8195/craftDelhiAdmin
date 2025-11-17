import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import ProductDelete from "./ProductDelete";
import Sample from "../../assets/images/sample.png";
import { toast } from "react-toastify";
import { getAdminToken } from "../../utils/auth";

const tableContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const tableRow = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const ProductTable = ({ card1 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [products, setProducts] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [search, setSearch] = useState("");
  const token = getAdminToken();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/totalproductsforadmin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.status) setProducts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const toggleDropdown = (index) =>
    setDropdownOpen(dropdownOpen === index ? null : index);

  const handleSelectStatus = async (index, newValue) => {
    const updated = [...products];
    updated[index].admin_approval = newValue;
    setProducts(updated);
    setDropdownOpen(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/updateproductstatus`,
        {
          product_id: updated[index].id,
          admin_approval: newValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status Updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const openDeleteModal = (product) => setDeleteProduct(product);
  const closeDeleteModal = () => setDeleteProduct(null);

  const statusStyle = (s) =>
    s === 1
      ? "bg-green-500 text-white"
      : s === 0
      ? "bg-yellow-400 text-black"
      : "bg-red-500 text-white";

  return (
    <div className="px-5 mt-6">
      {/* TOP BAR */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="text-black text-2xl font-bold">Product Management</div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-[239px] flex items-center gap-2 border border-gray-300 rounded px-2 h-10 bg-white">
            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs bg-transparent border-none outline-none"
            />
            <FaSearch className="text-gray-500 text-sm" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl shadow-lg bg-white overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {["ID", "Name", "Image", "Category", "Price", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="p-3 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <motion.tbody variants={tableContainer} initial="hidden" animate="show">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 text-sm font-medium"
                >
                  🚫 No product found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.tr
                  key={index}
                  variants={tableRow}
                  className="border-b hover:bg-[#f8f6ff] transition duration-200"
                >
                  <td className="p-4 text-[12px] font-medium text-gray-700">
                    {product.id}
                  </td>
                  <td className="p-4 text-[12px] text-gray-900">{product.name}</td>
                  <td className="p-4">
                    <img
                      src={product.main_image_url || Sample}
                      alt="product"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-4 text-[12px]">{product.category_id}</td>
                  <td className="p-4 text-[12px] font-semibold">₹{product.price}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <div className="relative flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold border shadow ${statusStyle(
                          product.admin_approval
                        )}`}
                      >
                        {product.admin_approval === 1
                          ? "Approved"
                          : product.admin_approval === 0
                          ? "Pending"
                          : "Rejected"}
                      </div>

                      <div className="relative">
                        <button onClick={() => toggleDropdown(index)}>
                          <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                        </button>

                        {dropdownOpen === index && (
                          <div className="absolute top-6 right-0 w-32 bg-white border shadow-md rounded-md z-50">
                            <button onClick={() => handleSelectStatus(index, 0)} className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                              Pending
                            </button>
                            <button onClick={() => handleSelectStatus(index, 1)} className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                              Approve
                            </button>
                            <button onClick={() => handleSelectStatus(index, 2)} className="px-4 py-2 text-sm hover:bg-gray-100 text-red-500 w-full text-left">
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-4 mt-3">
                    <motion.button whileHover={{ scale: 1.15 }} onClick={() => card1(product)}>
                      <LuPenLine className="text-blue-600 hover:text-blue-800" size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.15 }} onClick={() => openDeleteModal(product)}>
                      <FaTrash className="text-red-500 hover:text-red-700" size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteProduct && (
        <ProductDelete user={deleteProduct} close={closeDeleteModal} />
      )}
    </div>
  );
};

export default ProductTable;
