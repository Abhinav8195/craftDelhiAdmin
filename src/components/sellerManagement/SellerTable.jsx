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
    const user = updatedUsers[index];

    // If selected Reject -> open modal instead of direct update
    if (newStatusValue === 2) {
      setDeleteUser(user);
      setDropdownOpen(null);
      return;
    }

    // For Pending & Approved (0,1) update normally
    const previous = [...updatedUsers];
    const updated = [...updatedUsers];
    updated[index].status = newStatusValue;
    setUpdatedUsers(updated);
    setDropdownOpen(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}admin/update-seller-approval`,
        {
          seller_id: user.userId,
          user_approval: newStatusValue
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      setUpdatedUsers(previous);
    }
  };


  const handleRejectSeller = async (reason, description) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}admin/update-seller-approval`,
        {
          seller_id: DeleteUser.userId,
          user_approval: 2,
          reject_reason: reason,
          reject_description: description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        toast.success("Seller rejected");

        setUpdatedUsers(prev =>
          prev.map(u =>
            u.userId === DeleteUser.userId
              ? { ...u, status: 2 }
              : u
          )
        );

        closeDeleteModal();
      }
    } catch (err) {
      toast.error("Error updating seller");
    }
  };


  const statusStyle = (s) =>
    s === 1
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : s === 0
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-rose-100 text-rose-700 border-rose-200";

  return (
    <div className="px-5 mt-6">
      {/* Top Bar */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="text-black text-2xl font-bold">Seller Management</div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-[206px]">
            <select
              className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
              <option value="2">Trash</option>
            </select>
          </div>
          <div className="w-full sm:w-[239px] flex items-center gap-2 border border-gray-300 rounded px-2 h-10 bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
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
     <div className="border rounded-xl shadow-lg bg-white overflow-x-auto min-h-[250px]">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {["User ID", "Name", "Email", "Phone", "City", "Approvel Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`p-3 text-xs uppercase tracking-wider ${h === "Status" ? "w-40" : h === "Actions" ? "w-24" : ""
                    }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-20 text-gray-500 text-lg font-semibold">
                  😕 No Seller Found...
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.userId || index} className="border-b hover:bg-[#f8f6ff] transition duration-200">
                  <td className="p-4 text-[12px] font-medium text-gray-700">{user.userId}</td>
                  <td className="p-4 text-[12px] text-gray-900 font-semibold">{user.fullName}</td>
                  <td className="p-4 text-[12px] text-gray-600">{user.email}</td>
                  <td className="p-4 text-[12px] text-gray-600">{user.phone}</td>
                  <td className="p-4 text-[12px] text-gray-600">{user.city}</td>

                  {/* STATUS */}
                  <td className="p-4 w-40 relative">
                    <div className="relative flex items-center gap-2 w-max">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1.5 transition-all ${statusStyle(user.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 1 ? "bg-emerald-500" :
                          user.status === 0 ? "bg-amber-500" : "bg-rose-500"
                          }`} />
                        {user.status === 1 ? "Approved" : user.status === 0 ? "Pending" : "Rejected"}
                      </div>

                      <div className="relative">
                        <button onClick={() => toggleDropdown(index)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                        </button>

                   {dropdownOpen === index && (
  <div
    className={`absolute right-0 w-36 bg-white border border-gray-100 shadow-2xl rounded-xl z-[9999] py-1 overflow-hidden animate-in fade-in zoom-in duration-200
    ${
      filteredUsers.length > 5 && index >= filteredUsers.length - 5
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
                  <td className="p-4 w-24">
                    <div className="flex items-center gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        onClick={() => card1({ ...user })}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit Seller"
                      >
                        <LuPenLine size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        onClick={() => openDeleteModal(user)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                        title="Reject/Delete Seller"
                      >
                        <FaTrash size={18} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {DeleteUser && (
        <BuyerDelete user={DeleteUser} close={closeDeleteModal} onDelete={handleRejectSeller} />
      )}
    </div>
  );
};

export default SellerTable;
