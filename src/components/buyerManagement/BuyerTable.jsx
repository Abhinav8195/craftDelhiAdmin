import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDetails from './BuyerDetails';
import BuyerDelete from './BuyerDelete';
import { getAdminToken } from '../../utils/auth';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const BuyerTable = ({ card1 }) => {
    const [dropdownOpen, setDropdownOpen] = useState(null);
  const [users, setUsers] = useState([]); 
  const [updatedUsers, setUpdatedUsers] = useState([]); 
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const token = getAdminToken();

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}admin/buyers-view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const buyers = res.data.data.map(buyer => ({
            userId: buyer.user_id,
            first_name: buyer.first_name || "",
            last_name: buyer.last_name || "",
            name: `${buyer.first_name || ""} ${buyer.last_name || ""}`.trim(),
            email: buyer.email || "",
            phone: buyer.phone_number || "",
            profileImage: buyer.profile_image || "",
            date_of_birth: buyer.date_of_birth || "",
            gender: buyer.gender || "",
            city: buyer.city || "",
            street: buyer.street || "",
            state: buyer.state || "",
            country: buyer.country || "",
            postal_code: buyer.postal_code || "",
           status: Number(buyer.user_status),
          }));

          setUsers(buyers);
          setUpdatedUsers(buyers);
        }
      } catch (error) {
        console.error("Error fetching buyers:", error);
      }
    };

    fetchBuyers();
  }, []);

  const openModal = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const openDeleteModal = (user) => setDeleteUser(user);
  const closeDeleteModal = () => setDeleteUser(null);


  useEffect(() => {
    let filtered = [...users];

    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status.toString() === filterStatus);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.includes(search)
      );
    }

    setUpdatedUsers(filtered);
  }, [search, filterStatus, users]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

const handleSelectStatus = async (index, status) => {
  const user = updatedUsers[index];

  if (status === 2) {
    setDeleteUser(user);
    setDropdownOpen(null);
    return;
  }

  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}admin/update-buyerseller-status`,
      { user_id: user.userId, user_status: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      const newUsers = [...updatedUsers];
      newUsers[index].status = status;
      setUpdatedUsers(newUsers);
      toast.success("Status updated successfully");
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error("Failed to update status");
  }

  setDropdownOpen(null);
};

const handleTrashUser = async (reason, description) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}admin/update-buyerseller-status`,
      { 
        user_id: deleteUser.userId, 
        user_status: 2, 
        trash_reason: reason, 
        trash_description: description 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {

      const updatedList = users.map(u =>
        u.userId === deleteUser.userId ? { ...u, status: 2 } : u
      );

      setUsers(updatedList);

      toast.success("User successfully moved to Trash! 🗑💥");
    } else {
      toast.error(res.data.message);
    }

  } catch (error) {
    toast.error("Failed to move user to Trash");
  }

  closeDeleteModal(); 
};




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
        <div className="text-black text-2xl font-bold">Total Users</div>
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
      <div className="border rounded-xl shadow-lg bg-white overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-[#36234e] text-white">
            <tr>
              {["User ID", "Name", "Email Address", "Phone Number", "Status", "Actions"].map((h) => (
                <th 
                  key={h} 
                  className={`p-3 text-xs uppercase tracking-wider ${
                    h === "Status" ? "w-40" : h === "Actions" ? "w-24" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {updatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-20 text-gray-500 text-lg font-semibold">
                  😕 No Users Found...
                </td>
              </tr>
            ) : (
              updatedUsers.map((user, index) => (
                <tr key={user.userId || index} className="border-b hover:bg-[#f8f6ff] transition duration-200">
                  <td className="p-4 text-[12px] font-medium text-gray-700">{user.userId}</td>
                  <td className="p-4 text-[12px] text-gray-900 font-semibold">{user.name}</td>
                  <td className="p-4 text-[12px] text-gray-600">{user.email}</td>
                  <td className="p-4 text-[12px] text-gray-600">{user.phone}</td>

                  {/* STATUS */}
                  <td className="p-4 w-40 relative">
                    <div className="relative flex items-center gap-2 w-max">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1.5 transition-all ${statusStyle(user.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 1 ? "bg-emerald-500" :
                          user.status === 0 ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        {user.status === 1 ? "Active" : user.status === 0 ? "Inactive" : "Trashed"}
                      </div>

                      <div className="relative">
                        <button onClick={() => toggleDropdown(index)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <IoIosArrowDown size={18} className="text-gray-500 hover:text-black" />
                        </button>

                        {dropdownOpen === index && (
                          <div className={`absolute right-0 w-32 bg-white border border-gray-100 shadow-xl rounded-xl z-[100] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${
                            index >= updatedUsers.length - 2 ? "bottom-full mb-2" : "top-8"
                          }`}>
                            <button 
                              onClick={() => handleSelectStatus(index, 1)} 
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 w-full text-left flex items-center gap-2 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Active
                            </button>
                            <button 
                              onClick={() => handleSelectStatus(index, 0)} 
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 w-full text-left flex items-center gap-2 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Inactive
                            </button>
                            <button 
                              onClick={() => handleSelectStatus(index, 2)} 
                              className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-700 w-full text-left flex items-center gap-2 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              Trash
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 w-24 text-center">
                    <div className="flex items-center gap-4 justify-center">
                      <button 
                        onClick={() => openModal(user)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <FaRegEye size={18} />
                      </button>
                      <button 
                        onClick={() => card1(user)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                        title="Edit User"
                      >
                        <LuPenLine size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 p-4">
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-in fade-in zoom-in duration-300">
            <BuyerDetails user={selectedUser} close={closeModal} />
          </div>
        </div>
      )}

{deleteUser && (
  <BuyerDelete 
    user={deleteUser} 
    close={closeDeleteModal} 
    onDelete={handleTrashUser} 
  />
)}
    </div>
  );
};

export default BuyerTable;
