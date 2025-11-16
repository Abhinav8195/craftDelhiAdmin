import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { FaTrash } from "react-icons/fa6";
import BuyerDelete from "../buyerManagement/BuyerDelete";
import { motion } from "framer-motion";
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

const SellerTable = ({ card1 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [DeleteUser, setDeleteUser] = useState(null);
  const token = getAdminToken();
  const [filterStatus, setFilterStatus] = useState("all");
const [search, setSearch] = useState("");


 useEffect(() => {
  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("craftdelhiadmin_token");

      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/seller-view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        const sellers = res.data.data.map((seller) => ({
          ...seller,
          userId: seller.user_id,
          fullName: `${seller.first_name} ${seller.last_name}`,
          phone: seller.phone_number,
          city: seller.office_address || "N/A",
          status: seller.user_approval,
          accountHolderName: seller.account_holder_name,
          accountNumber: seller.account_number,
          bankName: seller.bank_name,
          branchLocation: seller.branch_location,
          gender: seller.gender,
          storeName: seller.store_name,
          storeID: seller.store_id,
          storeImage: seller.store_image,
          storeLink: seller.store_link,
          profileImage: seller.profile_image,
          dob: seller.date_of_birth,
          about: seller.description,
          businessNumber: seller.business_number,
        }));

        setUpdatedUsers(sellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  fetchSellers();
}, []);


  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const openDeleteModal = (user) => setDeleteUser(user);
  const closeDeleteModal = () => setDeleteUser(null);

  const filteredUsers = updatedUsers.filter((u) => {
  const text = search.toLowerCase();

  const matchesSearch =
    (u.fullName?.toLowerCase() || "").includes(text) ||
    (u.email?.toLowerCase() || "").includes(text) ||
    (u.phone?.toLowerCase() || "").includes(text) ||
    (u.storeName?.toLowerCase() || "").includes(text) ||
    (u.userId?.toString() || "").includes(text);

  if (filterStatus === "all") return matchesSearch;
  return matchesSearch && String(u.status) === String(filterStatus);
});



  const handleSelectStatus = async (index, newStatusValue) => {
    const previous = [...updatedUsers];
    const updated = [...updatedUsers];
    updated[index].status = newStatusValue;
    setUpdatedUsers(updated);
    setDropdownOpen(null);  

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/update-seller-approval`,
        {
          seller_id: updated[index].userId,
          user_approval: newStatusValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Seller status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      setUpdatedUsers(previous);
    }
  };

  const handleDeleteSeller = async (reason, description) => {
    try {
      const token = localStorage.getItem("craftdelhiadmin_token");

      const res = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/delete-sellerbyadmin/${DeleteUser.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { reason, description },
        }
      );

      if (res.data?.success) {
        toast.success("Seller deleted");
        setUpdatedUsers((prev) =>
          prev.filter((u) => u.userId !== DeleteUser.userId)
        );
        closeDeleteModal();
      }
    } catch {
      toast.error("Error deleting seller");
    }
  };

  const getStatusInfo = (status) =>
    ({
      0: { text: "Pending" },
      1: { text: "Approved" },
      2: { text: "Rejected" },
    }[status] || { text: "Unknown" });

  return (
    <div className="px-5 mt-6">
      {/* Top Bar */}
       <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
                <div className="text-black text-2xl font-bold">Seller Management</div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="w-full sm:w-[206px]">
                     <select
                    className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                    <option value="2">Trash</option>
                  </select>
                  </div>
                 <div className="w-full sm:w-[239px] flex items-center gap-2 border border-gray-300 rounded px-2 h-10 bg-white">
              <input
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
              />
              <FaSearch className="text-gray-500 text-sm" />
            </div>

                </div>
              </div>

      {/* TABLE */}
     <div className="border rounded-xl shadow-lg bg-white backdrop-blur-lg overflow-x-auto">

       <table className="w-full min-w-[750px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {["User ID", "Name", "Email", "Phone", "City", "Status", "Actions"].map((h) => (
                <th key={h} className="p-3 text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <motion.tbody variants={tableContainer} initial="hidden" animate="show">
  {filteredUsers.length === 0 ? (
    <tr>
      <td
        colSpan="7"
        className="text-center py-6 text-gray-500 text-sm font-medium"
      >
        🚫 No seller found
      </td>
    </tr>
  ) : (
    filteredUsers.map((user, index) => {
      const { text } = getStatusInfo(user.status);

      return (
        <motion.tr
          key={index}
           variants={tableRow}
  initial="hidden"
  animate="show"
  
          className="border-b hover:bg-[#f8f6ff] transition duration-200"
        >
          <td className="p-4 text-[12px] font-medium text-gray-700">{user.userId}</td>
          <td className="p-4 text-[12px] font-semibold text-gray-900">{user.fullName}</td>
          <td className="p-4 text-[12px] text-gray-600">{user.email}</td>
          <td className="p-4 text-[12px]">{user.phone}</td>
          <td className="p-4 text-[12px]">{user.city}</td>

          {/* Status Badge */}
          <td className="p-4">
            <div className="relative flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.06 }}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold text-white border shadow
                  ${
                    user.status === 1
                      ? "bg-green-500"
                      : user.status === 2
                      ? "bg-red-500"
                      : "bg-yellow-400 text-black"
                  }`}
              >
                {text}
              </motion.div>

              <button onClick={() => toggleDropdown(index)}>
                <IoIosArrowDown
                  size={18}
                  className="text-gray-500 hover:text-black"
                />
              </button>
            </div>
          </td>

          {/* Actions */}
          <td className="p-4 w-[120px]">
            <div className="flex justify-center items-center gap-4">
              <motion.button whileHover={{ scale: 1.15 }} onClick={() => card1({ ...user })}>
                <LuPenLine size={18} className="text-blue-600 hover:text-blue-800" />
              </motion.button>

              <motion.button whileHover={{ scale: 1.15 }} onClick={() => openDeleteModal(user)}>
                <FaTrash size={18} className="text-red-500 hover:text-red-700" />
              </motion.button>
            </div>
          </td>
        </motion.tr>
      );
    })
  )}
</motion.tbody>

        </table>
      </div>

      {DeleteUser && (
        <BuyerDelete user={DeleteUser} close={closeDeleteModal} onDelete={handleDeleteSeller} />
      )}
    </div>
  );
};

export default SellerTable;
