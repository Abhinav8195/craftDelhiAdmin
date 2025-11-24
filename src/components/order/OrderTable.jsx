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
    ? "bg-green-500 text-white"
    : s === 0
    ? "bg-yellow-400 text-black"
    : "bg-red-500 text-white";

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
      <div className="w-full flex flex-wrap justify-between items-center mb-5 gap-3">
        <div className="text-black text-2xl font-bold">Order Management</div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 text-xs border border-gray-300 rounded px-3 bg-white"
          />

          <div className="w-full sm:w-[180px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(Number(e.target.value))}
              className="w-full h-10 text-xs border border-gray-300 rounded px-3 bg-white"
            >
              <option value="">Payment Status</option>
              <option value="0">Pending</option>
              <option value="1">Paid</option>
              <option value="2">Refund</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 h-10 bg-white">
            <input
              placeholder="Search Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs bg-transparent outline-none"
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
                <th key={h} className="p-3 text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <motion.tbody variants={tableContainer} initial="hidden" animate="show">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  🚫 No Orders Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.tr key={order.id} variants={tableRow} className="border-b hover:bg-[#f8f6ff] transition">
                  <td className="p-4 text-[12px] font-semibold">{order.order_uid}</td>
                  <td className="p-4 text-[12px]">{order.items[0].product_id}</td>
                  <td className="p-4 text-[12px] font-medium">{order.items[0].product.name}</td>

                  <td className="p-4">
                    <img src={order.items[0].product.main_image_url} alt="product" className="w-12 h-12 rounded-lg object-cover" />
                  </td>

                  <td className="p-4 text-[12px]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-[12px] font-semibold">₹{order.items[0].price}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <div className="relative flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-semibold border shadow ${statusStyle(order.payment_status)}`}>
                        {order.payment_status === 1 ? "Paid" : order.payment_status === 0 ? "Pending" : "Refund"}
                      </div>

                      <button onClick={() => toggleDropdown(index)}>
                        <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                      </button>

                      {dropdownOpen === index && (
                        <div className="absolute top-6 right-0 w-32 bg-white rounded-md shadow border z-50">
                          {[{ id: 0, label: "Pending" }, { id: 1, label: "Paid" }, { id: 2, label: "Refund" }].map((opt) => (
                            <button
                              key={opt.id}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => handleSelectStatus(order.id, opt.id)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-3 mt-3">
                    <LuPenLine 
  onClick={() => card1(1, order)} 
  className="text-blue-600 cursor-pointer hover:text-blue-900"
/>

                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => setDeleteUser(order)}
                    />
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
