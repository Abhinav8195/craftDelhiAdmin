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

const ProductTable = ({ card1,filterType }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [products, setProducts] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [search, setSearch] = useState("");
  const token = getAdminToken();

 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}admin/totalproductsforadmin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.status) setProducts((res.data.data || []));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const toggleDropdown = (index) =>
    setDropdownOpen(dropdownOpen === index ? null : index);

const handleSelectStatus = (index, newValue) => {

  // 🔥 if Reject → open reason modal instead of calling API now
  if (newValue === 2) {
    setDeleteProduct({ ...products[index], index });
    setDropdownOpen(null);
    return;
  }

  // 👇 For Pending(0) or Approve(1) → direct update
  updateProductStatus(products[index].id, newValue);

  const updated = [...products];
  updated[index].admin_approval = newValue;
  setProducts(updated);

  setDropdownOpen(null);
};

const updateProductStatus = async (productId, status, reject_reason = "", reject_description = "") => {
  try {
    await axios.put(
      `${process.env.REACT_APP_BASE_URL}admin/update-product-approval/${productId}`,
      {
        status,
        reject_reason,
        reject_description
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Status Updated");

    // refresh UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, admin_approval: status } : p
      )
    );
  } catch (err) {
    toast.error("Failed to update");
  }
};

const handleReject = async (product, reason, desc) => {
  await updateProductStatus(product.id, 2, reason, desc);

  setProducts(prev =>
    prev.map(p =>
      p.id === product.id ? { ...p, admin_approval: 2 } : p
    )
  );

  closeDeleteModal();
};




const filteredProducts = products.filter((product) => {
  // ✅ status filter
  if (filterType === "pending" && product.admin_approval !== 0) {
    return false;
  }

  // ✅ search filter
  if (
    !(product.name?.toLowerCase() || "").includes(search.toLowerCase())
  ) {
    return false;
  }

  return true;
});

  const openDeleteModal = (product) => setDeleteProduct(product);
  const closeDeleteModal = () => setDeleteProduct(null);

  const statusStyle = (s) =>
    s === 1
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : s === 0
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

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
              className="flex-1 text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
            />
            <FaSearch className="text-gray-500 text-sm" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl shadow-lg bg-white overflow-x-auto min-h-[300px]">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {["ID", "Name", "Image", "Category", "Price", "Status", "Actions"].map(
                (h) => (
                  <th 
                    key={h} 
                    className={`p-3 text-xs uppercase tracking-wider ${
                      h === "Status" ? "w-40" : h === "Actions" ? "w-20" : ""
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
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
                <tr
                  key={product.id || index}
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
                  <td className="p-4 text-[12px]">{product?.category_name}</td>
                  <td className="p-4 text-[12px] font-semibold">₹{product.price}</td>

                  {/* STATUS */}
                  <td className="p-4 w-40 relative">
                    <div className="relative flex items-center gap-2 w-max">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1.5 transition-all ${statusStyle(
                          product.admin_approval
                        )}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          product.admin_approval === 1 ? "bg-emerald-500" :
                          product.admin_approval === 0 ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        {product.admin_approval === 1
                          ? "Approved"
                          : product.admin_approval === 0
                          ? "Pending"
                          : "Rejected"}
                      </div>

                     <div className="relative">
                                             <button onClick={() => toggleDropdown(index)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                               <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                                             </button>
                     
                                        {dropdownOpen === index && (
                       <div
                         className={`absolute right-0 w-36 bg-white border border-gray-100 shadow-2xl rounded-xl z-[9999] py-1 overflow-hidden animate-in fade-in zoom-in duration-200
                         ${
                           filteredProducts.length > 2 && index >= filteredProducts.length - 2
                             ? "bottom-full mb-2"
                             : "top-8"
                         }`}
                       >
                         <button
                           onClick={() => handleSelectStatus(index, 1)}
                           className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 w-full text-left flex items-center gap-2 transition-colors"
                         >
                           <span className="w-2 h-2 rounded-full bg-emerald-500" />
                           Approve
                         </button>
                     
                         <button
                           onClick={() => handleSelectStatus(index, 0)}
                           className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 w-full text-left flex items-center gap-2 transition-colors"
                         >
                           <span className="w-2 h-2 rounded-full bg-amber-500" />
                           Pending
                         </button>
                     
                         <button
                           onClick={() => handleSelectStatus(index, 2)}
                           className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-700 w-full text-left flex items-center gap-2 transition-colors"
                         >
                           <span className="w-2 h-2 rounded-full bg-rose-500" />
                           Reject
                         </button>
                       </div>
                     )}
                                           </div>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex items-center gap-4 h-full">
                      <motion.button 
                        whileHover={{ scale: 1.15 }} 
                        onClick={() => card1(product)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <LuPenLine className="text-blue-600" size={18} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteProduct && (
  <ProductDelete 
    user={deleteProduct} 
    close={closeDeleteModal} 
    onDelete={(reason, desc) =>
      handleReject(deleteProduct, reason, desc)
    }
  />
)}

    </div>
  );
};

export default ProductTable;
