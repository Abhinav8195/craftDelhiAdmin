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
      `${process.env.REACT_APP_BASE_URL}admin/update-buyer-status`,
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
      `${process.env.REACT_APP_BASE_URL}admin/update-buyer-status`,
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





  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
        <div className="w-full flex flex-wrap justify-between items-center gap-3">
          <div className="text-black text-2xl font-bold">Total Users</div>
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

         {updatedUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center text-gray-500 py-20 text-lg font-semibold"
          >
            😕 No Users Found...
          </motion.div>
        ):(
           <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          <div className="w-[130px] flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                User ID
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center">
                <div className="text-black text-[10px] font-medium">{user.userId}</div>
              </div>
            ))}
          </div>

          <div className="grow flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Name
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center">
                <div className="text-black text-[10px] font-medium">{user.name}</div>
              </div>
            ))}
          </div>

          <div className="grow flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Email Address
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center">
                <div className="text-black text-[10px] font-medium">{user.email}</div>
              </div>
            ))}
          </div>

          <div className="grow flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Phone Number
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center">
                <div className="text-black text-[10px] font-medium">{user.phone}</div>
              </div>
            ))}
          </div>

          <div className="grow flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Status
              </div>
            </div>

            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center gap-2">
                 <span
                  className={`px-2 py-1 rounded text-white text-[10px] font-medium
                    ${user.status === 1 ? "bg-green-600" : user.status === 0 ? "bg-yellow-500" : "bg-gray-600"}`}
                >
                  {user.status === 1 ? "Active" : user.status === 0 ? "Inactive" : "Trashed"}
                </span>


                <div className="relative w-4 h-4">
                  <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                  {dropdownOpen === index && (
                    <div className="absolute left-0 top-full z-50 bg-white border border-gray-300 mt-1 rounded w-[90px] shadow-md text-[10px]">

                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectStatus(index, 1)}>Active</div>

                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectStatus(index, 0)}>Inactive</div>

                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectStatus(index, 2)}>Trash</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grow flex-col gap-px inline-flex items-center">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Actions
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] gap-5 p-3 bg-white flex items-center justify-center">
                <button onClick={() => openModal(user)}><FaRegEye /></button>
                <button onClick={() => card1(user)}>
                <LuPenLine />
              </button>
                {/* <button onClick={() => openDeleteModal(user)}><FaTrash /></button> */}
              </div>
            ))}
          </div>
        </div>
        )}

       
      </div>

      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg" onClick={closeModal} />
          <div className="relative w-[883px] h-[712px] p-5 bg-white rounded-2xl shadow-2xl border border-[#d9d9d9] flex flex-col z-50">
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
