import React from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import { FaSearch } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

// Dummy data
const dummyData = [
  {
    userId: '01',
    name: 'John Doe',
    role: 'Buyer',
    status: 'Active'
  },
  {
    userId: '02',
    name: 'Jane Smith',
    role: 'Seller',
    status: 'In Active'
  },
  {
    userId: '03',
    name: 'Sam Wilson',
    role: 'Buyer',
    status: 'Active'
  },
  {
    userId: '04',
    name: 'Lucy Brown',
    role: 'Seller',
    status: 'In Active'
  }
];

const UserTable = () => {
  return (
   <>
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-30px]">

{/* Title */}
<div className="text-black text-2xl font-bold font-['Montserrat'] mb-3 text-center md:text-left">
  Total Users
</div>

{/* Total Users Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Card 1 */}
  <div className="h-[180px] p-5 bg-[#ffe2e6] rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
    <img src={IconUserCheck_01} alt="Logo" className="w-10 h-10" />
    <div className="text-black text-base font-bold">Total Number Of Users</div>
    <div className="text-black text-2xl font-bold">87</div>
    <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
  </div>

  {/* Card 2 */}
  <NavLink>
    <div className="h-[180px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
      <img src={IconShoppingBag_02} alt="Logo" className="w-10 h-10" />
      <div className="text-black text-base font-bold">Total Number Of Active Sellers</div>
      <div className="text-black text-2xl font-bold">2100</div>
      <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
    </div>
  </NavLink>

  {/* Card 3 */}
  <NavLink>
    <div className="h-[180px] p-5 bg-gradient-to-b from-green-100 to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
      <img src={IconFaceContent} alt="Logo" className="w-10 h-10" />
      <div className="text-black text-base font-bold">Total Number Of Active Buyers</div>
      <div className="text-black text-2xl font-bold">14</div>
      <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
    </div>
  </NavLink>
</div>
</div>

 <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
    
  <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
  <div className="w-full flex flex-wrap justify-between items-center gap-3">
    <div className="text-black text-2xl font-bold">Total Users</div>
    
    {/* Dropdown और Search Input Flex */}
    <div className="flex gap-2 w-full sm:w-auto">
      {/* Dropdown */}
      <div className="w-full sm:w-[206px]">
        <select className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2"  defaultValue="1">
        <option value="1">Buyer/Seller/Trash</option>
      <option value="Buyer">Buyer</option>
      <option value="Seller">Seller</option>
      <option value="Trash">Trash</option>
        </select>
      </div>

      {/* Search Box */}
      <div className="relative w-full sm:w-[239px]">
        <input
          placeholder="Customer Name"
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
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">ROLE</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.role}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
      <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
        <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">STATUS</div>
      </div>
      {dummyData.map((user, index) => (
        <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
        <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex ${user.status === 'Active' ? 'bg-[#69d297]' : 'bg-[#fe0000]'}`}>
          <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
          </div>
        </div>
      ))}
    </div>

         
        </div>
      </div>
    </div>

 
   </>
   
  );
};

export default UserTable;
