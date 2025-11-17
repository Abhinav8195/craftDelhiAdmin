import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaTrash } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import ProductDelete from "../Product/ProductDelete";
import { getAdminToken } from "../../utils/auth";

const OrderTable = ({ card1 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [orders, setOrders] = useState([]);
  const [DeleteProduct, setDeleteProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const token  = getAdminToken();

  const statusColors = {
    Refunded: "#ffc600",
    Paid: "#69d297",
    Cancelled: "#fe0000",
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}admin/orders-view`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "craftdelhiadmin_token"
              )}`,
            },
          }
        );

        console.log(res)

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        console.log(data)
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openDeleteModal = (product) => setDeleteProduct(product);
  const closeDeleteModal = () => setDeleteProduct(null);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSelectStatus = (orderIndex, status) => {
    const updated = [...orders];
    updated[orderIndex].payment_status = status;
    setOrders(updated);
    setDropdownOpen(null);
  };

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
        {/* Header */}
        <div className="w-full flex flex-wrap justify-between items-center gap-2">
          <div className="text-black text-2xl font-bold">Order List's</div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Date Filter */}
            <div className="w-full sm:w-[206px]">
              <DateInputField
                label="Select Date"
                name="selectedDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Payment Status Filter */}
            <div className="w-full sm:w-[180px]">
              <select className="w-full h-10 text-[10px] bg-white border border-gray-300 rounded px-2">
                <option value="1">Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-[239px]">
              <input
                placeholder="Search"
                className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                <FaSearch />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
       <table className="w-full border-collapse">
  <thead>
    <tr className="bg-[#36234e] text-white text-[10px] uppercase tracking-widest">
      <th className="p-3 text-left">ORDER ID</th>
      <th className="p-3 text-left">Product Id</th>
      <th className="p-3 text-left">Product Name</th>
      <th className="p-3 text-left">Product Image</th>
      <th className="p-3 text-left">Date</th>
      <th className="p-3 text-left">Price</th>
      <th className="p-3 text-left">Status</th>
      <th className="p-3 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) =>
      order.items.map((item) => (
        <tr key={`${order.id}-${item.item_id}`} className="border-b">
          <td className="p-3 text-xs">{order.order_uid}</td>
          <td className="p-3 text-xs">{item.product_id}</td>
          <td className="p-3 text-xs">{item.product.name}</td>
          <td className="p-3">
            <img src={item.product.main_image_url} alt={item.product.name} className="w-12 h-12 rounded-full" />
          </td>
          <td className="p-3 text-xs">
            {new Date(order.created_at).toLocaleDateString()}
          </td>
          <td className="p-3 text-xs">₹{item.price}</td>
         <td className="p-3 text-xs">
  <select
    className={`border rounded px-2 py-1 text-xs font-semibold text-white
      ${order.payment_status === 1 ? "bg-green-500" : ""}
      ${order.payment_status === 0 ? "bg-red-500" : ""}
      ${order.payment_status === 2 ? "bg-yellow-500" : ""}`}
    value={
      order.payment_status === 1
        ? "Paid"
        : order.payment_status === 0
        ? "Cancelled"
        : "Refunded"
    }
    onChange={(e) => handleSelectStatus(order.id, e.target.value)}
  >
    <option value="Paid">Paid</option>
    <option value="Cancelled">Cancelled</option>
    <option value="Refunded">Refunded</option>
  </select>
</td>

         <td className="p-3 text-xs">
  <div className="flex items-center justify-center gap-3">
    <button onClick={() => card1(1)} className="text-gray-600 hover:text-indigo-600">
      <LuPenLine size={15} />
    </button>
    <button onClick={() => openDeleteModal(order)} className="text-gray-600 hover:text-red-600">
      <FaTrash size={15}/>
    </button>
  </div>
</td>

        </tr>
      ))
    )}
  </tbody>
</table>

      </div>

     {DeleteProduct && (
  <ProductDelete
    user={DeleteProduct}
    close={closeDeleteModal}
    onDelete={async (reason, description) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}admin/order-delete/${DeleteProduct.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "craftdelhiadmin_token"
              )}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(orders.filter(o => o.id !== DeleteProduct.id));
          closeDeleteModal();
        } else {
          alert(data.message || "Failed to delete order");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong while deleting order");
      }
    }}
  />
)}

    </div>
  );
};

const DateInputField = ({ label, name, value, onChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="date"
        className="w-full h-10 px-3 bg-white rounded border border-gray-300 text-xs"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default OrderTable;
