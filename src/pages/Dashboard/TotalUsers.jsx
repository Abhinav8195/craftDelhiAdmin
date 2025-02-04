import React from 'react'
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import { NavLink } from 'react-router-dom';

const TotalUsers = ({card1}) => {
  return (
    <>
     {/* Title */}
     <div className="text-black text-2xl font-bold font-['Montserrat'] mb-3 text-center md:text-left">
        Total Users
      </div>

      {/* Total Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <NavLink onClick={() => card1(1)}>
       <div className="h-[180px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
          <img src={IconUserCheck_01} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold">Total Number Of Users</div>
          <div className="text-black text-2xl font-bold">87</div>
          <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
        </div>
       </NavLink>

        {/* Card 2 */}
        <div className="h-[180px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
          <img src={IconShoppingBag_02} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold">Total Number Of Active Sellers</div>
          <div className="text-black text-2xl font-bold">2100</div>
          <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
        </div>

        {/* Card 3 */}
        <div className="h-[180px] p-5 bg-gradient-to-b from-green-100 to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
          <img src={IconFaceContent} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold">Total Number Of Active Buyers</div>
          <div className="text-black text-2xl font-bold">14</div>
          <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
        </div>
      </div>
    </>
  )
}

export default TotalUsers