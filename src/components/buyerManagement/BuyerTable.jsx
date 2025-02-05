import React, { useState } from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDetails from './BuyerDetails';
import BuyerDelete from './BuyerDelete';


const dummyData = [
  {
    userId: '01',
    name: 'John Doe',
    email: 'admin@gmail.com',
    status: 'Approved',
    phone:'+911234567890'
  },
  {
    userId: '02',
    name: 'Jane Smith',
    email: 'admin@gmail.com',
    status: ' Approved',
     phone:'+911234567890'
  },
  {
    userId: '03',
    name: 'Sam Wilson',
    email: 'admin@gmail.com',
    status: 'Approved',
     phone:'+911234567890'
  },
  {
    userId: '04',
    name: 'Lucy Brown',
    email: 'admin@gmail.com',
    status: 'Rejected',
     phone:'+911234567890'
  }
];

const BuyerTable = ({card1}) => {
    const [dropdownOpen, setDropdownOpen] = useState(null); 
  const [updatedUsers, setUpdatedUsers] = useState(dummyData); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [DeleteUser, setDeleteUser] = useState(null);
  
  const openModal = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const openDeleteModal=(user)=>{
    setDeleteUser(user);
  }
  const closeDeleteModal = () => {
    setDeleteUser(null);
  };
 
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index); 
  };

  // Handle selecting a new status for a user
  const handleSelectStatus = (index, status) => {
    const newUsers = [...updatedUsers];
    newUsers[index].status = status; // Update the status of the selected user
    setUpdatedUsers(newUsers);
    setDropdownOpen(null); // Close the dropdown after selecting a status
  };
  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      {/* Table Section */}
      <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
  <div className="w-full flex flex-wrap justify-between items-center gap-3">
    <div className="text-black text-2xl font-bold">Total Users</div>
    
    {/* Dropdown और Search Input Flex */}
    <div className="flex gap-2 w-full sm:w-auto">
      {/* Dropdown */}
      <div className="w-full sm:w-[206px]">
        <select className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2">
          <option value="1">Trash/Approved</option>
          <option value="Approved">Approved</option>
          <option value="Trash">Trash</option>
        </select>
      </div>

      {/* Search Box */}
      <div className="relative w-full sm:w-[239px]">
        <input
          placeholder="Search"
          className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
        />
         <div  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                          <FaSearch />
                          </div>
      </div>
    </div>
  </div>



        {/* Table Headers */}
        <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          <div className="w-[130px] flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">USER ID</div>
            </div>
            {/* Table Rows */}
            {dummyData.map((user, index) => (
            <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.userId}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">NAME</div>
            </div>
            {dummyData.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.name}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">EMAIL ADDRESS</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.email}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">PHONE NUMBER</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.phone}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">STATUS</div>
            </div>
            {updatedUsers.map((user, index) => (
              <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex ${user.status === 'Approved' ? 'bg-[#69d297]' : 'bg-[#fe0000]'}`}>
                  <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                </div>
                <div className="relative w-4 h-4 overflow-hidden">
                  <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                </div>

                
                {/* Dropdown */}
                {dropdownOpen === index && (
    <div className="absolute right-10 bg-white border border-[#e0e4f4] mt-2 rounded w-24 shadow-lg z-10">
      <div 
        className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4]" 
        onClick={() => handleSelectStatus(index, 'Approved')}
      >
        Approved
      </div>
      <div 
        className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4]" 
        onClick={() => handleSelectStatus(index, 'Rejected')}
      >
        Rejected
      </div>
    </div>
  )}
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-center items-center gap-px inline-flex">
  <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">ACTIONS</div>
  </div>
  {dummyData.map((user, index) => (
    <div key={index} className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex">
      <button className="w-4 h-4 relative overflow-hidden" onClick={() => openModal(user)}>
        <FaRegEye />
      </button>
      <button className="w-4 h-4 relative overflow-hidden" onClick={() => card1(1)}>
        <LuPenLine  />
      </button>
      <button className="w-4 h-4 relative overflow-hidden " onClick={() => openDeleteModal(user)}>
        <FaTrash />
      </button>
    </div>
  ))}
</div>

        </div>
      </div>


      {selectedUser && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg" onClick={closeModal} />
    <div className="relative w-[883px] h-[712px] p-5 bg-white rounded-2xl shadow-2xl border border-[#d9d9d9] flex flex-col justify-start items-start gap-4 z-50">
      <BuyerDetails user={selectedUser} close={closeModal} />
    </div>
  </div>
)}
{DeleteUser && (
  
      <BuyerDelete user={DeleteUser} close={closeDeleteModal} />


)}

    </div>
  );
};

export default BuyerTable;
