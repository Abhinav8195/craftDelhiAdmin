import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDetails from './BuyerDetails';
import BuyerDelete from './BuyerDelete';
import { getAdminToken } from '../../utils/auth';

const BuyerTable = ({ card1 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const token = getAdminToken();

  // Fetch buyers on mount
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}admin/buyers-view`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        console.log(res.data)

        if (res.data.success) {
          const buyers = res.data.data.map(buyer => ({
            userId: buyer.user_id,
            name: `${buyer.first_name} ${buyer.last_name}`,
            email: buyer.email,
            status: buyer.user_status,

            phone: buyer.phone_number,
            profileImage: buyer.profile_image,
          }));
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

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSelectStatus = (index, status) => {
    const newUsers = [...updatedUsers];
    newUsers[index].status = status;
    setUpdatedUsers(newUsers);
    setDropdownOpen(null);
  };

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      {/* Table Section */}
      <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
        <div className="w-full flex flex-wrap justify-between items-center gap-3">
          <div className="text-black text-2xl font-bold">Total Users</div>
          
          {/* Filter + Search */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-[206px]">
              <select className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2">
                <option value="1">Trash/Approved</option>
                <option value="Approved">Approved</option>
                <option value="Trash">Trash</option>
              </select>
            </div>
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
        <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          {/* User ID */}
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

          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Status */}
          <div className="grow flex-col gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Status
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white flex items-center gap-2">
                <div className="flex items-center gap-2">
  <span
    className={`px-2 py-1 rounded text-white text-[10px] font-medium
      ${user.status === 0 ? "bg-yellow-500" :
        user.status === 1 ? "bg-green-500" :
        "bg-red-500"}`}
  >
    {user.status === 0 ? "Pending" : user.status === 1 ? "Approved" : "Rejected"}
  </span>

  <div className="relative w-4 h-4">
    <IoIosArrowDown onClick={() => toggleDropdown(index)} />

    {dropdownOpen === index && (
      <div className="absolute left-0 top-full z-50 bg-white border border-gray-300 mt-1 rounded w-24 shadow-md text-[10px]">

        <div
          onClick={() => handleSelectStatus(index, 1)}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          Approved
        </div>

        <div
          onClick={() => handleSelectStatus(index, 2)}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          Rejected
        </div>

        <div
          onClick={() => handleSelectStatus(index, 0)}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          Pending
        </div>

      </div>
    )}
  </div>
</div>

              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="grow flex-col gap-px inline-flex items-center">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] flex items-center">
              <div className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                Actions
              </div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] gap-5 p-3 bg-white flex items-center justify-center">
                <button onClick={() => openModal(user)}><FaRegEye /></button>
                <button onClick={() => card1(1)}><LuPenLine /></button>
                <button onClick={() => openDeleteModal(user)}><FaTrash /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg" onClick={closeModal} />
          <div className="relative w-[883px] h-[712px] p-5 bg-white rounded-2xl shadow-2xl border border-[#d9d9d9] flex flex-col z-50">
            <BuyerDetails user={selectedUser} close={closeModal} />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteUser && (
        <BuyerDelete user={deleteUser} close={closeDeleteModal} />
      )}
    </div>
  );
};

export default BuyerTable;
