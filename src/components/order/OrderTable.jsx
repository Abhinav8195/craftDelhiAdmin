import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import ProductDelete from "../Product/ProductDelete";
import { getAdminToken } from "../../utils/auth";
import { toast } from "react-toastify";

const tableContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const tableRow = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const statusStyle = (s) =>
  s === 1
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : s === 0
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : s === 4
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-rose-100 text-rose-700 border-rose-200";

const OrderTable = ({ card1 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);

  const token = getAdminToken();

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}admin/orders-view`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDropdown = (index) =>
    setDropdownOpen(dropdownOpen === index ? null : index);

  // **FIXED STATUS UPDATE**
  const handleSelectStatus = async (orderId, newValue) => {
    try {
      const selectedOrder = orders.find((o) => o.id === orderId);

      const payload = {
        ...selectedOrder,
        payment_status: Number(newValue),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}order/updatedetails/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      const isSuccess =
        data?.success === true ||
        data?.message?.toLowerCase().includes("updated") ||
        res.ok;

      if (isSuccess) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, payment_status: Number(newValue) } : o
          )
        );

        toast.success("Payment Status Updated Successfully 🎉");
        setDropdownOpen(null);
      } else {
        toast.error(data.message || "Failed to update status ❌");
      }
    } catch (err) {
      toast.error("Something went wrong ❌");
      console.log(err);
    }
  };

  // **DELETE FIX**
  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}admin/order-delete/${orderId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      const isSuccess =
        data?.success === true ||
        data?.message?.toLowerCase().includes("deleted") ||
        res.ok;

      if (isSuccess) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        toast.success("Order Deleted Successfully 🗑️");
      } else {
        toast.error(data.message || "Failed to delete ❌");
      }
    } catch (err) {
      toast.error("Something went wrong ❌");
      console.log(err);
    }
  };

  // FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_uid
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filterStatus !== "" ? Number(order.payment_status) === Number(filterStatus) : true;

    const matchesDate = selectedDate
      ? new Date(order.created_at).toLocaleDateString("en-CA") === selectedDate
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="px-5 mt-6">
      {/* TOP BAR */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="text-black text-2xl font-bold">Order Management</div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-[150px] flex items-center gap-2 border border-gray-300 rounded px-3 h-10 bg-white text-xs outline-none focus:outline-none focus:ring-0"
          />

          <div className="w-full sm:w-[150px] border border-gray-300 rounded h-10 bg-white">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full h-full text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-3 text-gray-700"
            >
              <option value="">Payment Status</option>
              <option value="0">Pending</option>
              <option value="1">Paid</option>
              <option value="2">Refund</option>
              <option value="4">Cancelled</option>
            </select>
          </div>

          <div className="w-full sm:w-[239px] flex items-center gap-2 border border-gray-300 rounded px-2 h-10 bg-white">
            <input
              placeholder="Search Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0"
            />
            <FaSearch className="text-gray-500 text-sm" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl shadow-lg bg-white overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {[
                "Order ID",
                "Product ID",
                "Product Name",
                "Image",
                "Date",
                "Price",
                "Status",
                "Actions",
              ].map((h) => (
                <th 
                  key={h} 
                  className={`p-3 text-xs uppercase tracking-wider ${
                    h === "Status" ? "w-40" : h === "Actions" ? "w-20" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <motion.tbody variants={tableContainer} initial="hidden" animate="show" className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500 text-sm font-medium">
                  🚫 No Orders Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.tr 
                  key={order.id} 
                  variants={tableRow} 
                  className="border-b hover:bg-[#f8f6ff] transition duration-200"
                >
                  <td className="p-4 text-[12px] font-medium text-gray-700">{order.order_uid}</td>
                  <td className="p-4 text-[12px] text-gray-900">{order.items[0]?.product_id}</td>
                  <td className="p-4 text-[12px] text-gray-900">{order.items[0]?.product?.name}</td>

                  <td className="p-4">
                    <img src={order.items[0]?.product?.main_image_url} alt="product" className="w-12 h-12 rounded-lg object-cover" />
                  </td>

                  <td className="p-4 text-[12px] text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-[12px] font-semibold">₹{order.items[0]?.price}</td>

                  {/* STATUS */}
                  <td className="p-4 w-40 relative">
                    <div className="relative flex items-center gap-2 w-max">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1.5 transition-all ${statusStyle(order.payment_status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.payment_status === 1 ? "bg-emerald-500" :
                          order.payment_status === 0 ? "bg-amber-500" : 
                          order.payment_status === 4 ? "bg-red-500" : "bg-rose-500"
                        }`} />
                        {order.payment_status === 1 ? "Paid" : 
                         order.payment_status === 0 ? "Pending" : 
                         order.payment_status === 4 ? "Cancelled" : "Refund"}
                      </div>

                      <div className="relative">
                        <button onClick={() => toggleDropdown(index)}>
                          <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                        </button>

                        {dropdownOpen === index && (
                          <div className={`absolute right-0 w-36 bg-white border border-gray-100 shadow-xl rounded-xl z-[100] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${
                            index >= filteredOrders.length - 2 ? "bottom-full mb-2" : "top-8"
                          }`}>
                            <button
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 w-full text-left flex items-center gap-2 transition-colors"
                              onClick={() => handleSelectStatus(order.id, 0)}
                            >
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Pending
                            </button>
                            <button
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 w-full text-left flex items-center gap-2 transition-colors"
                              onClick={() => handleSelectStatus(order.id, 1)}
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Paid
                            </button>
                            <button
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-700 w-full text-left flex items-center gap-2 transition-colors"
                              onClick={() => handleSelectStatus(order.id, 2)}
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              Refund
                            </button>
                            <button
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left flex items-center gap-2 transition-colors"
                              onClick={() => handleSelectStatus(order.id, 4)}
                            >
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              Cancelled
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
                        onClick={() => card1(1, order)} 
                        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <LuPenLine className="text-blue-600" size={18} />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.15 }} 
                        onClick={() => setDeleteUser(order)} 
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FaTrash className="text-red-500" size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {deleteUser && (
        <ProductDelete user={deleteUser} close={() => setDeleteUser(null)} onDelete={() => handleDeleteOrder(deleteUser.id)} />
      )}
    </div>
  );
};

export default OrderTable;
