import React from 'react';
import IconCoins_04 from '../../assets/images/IconCoins_04.png';
import new1 from '../../assets/images/new1.png'
import { NavLink } from 'react-router-dom';


const TotalRevenue = ({card1}) => {
  return (
   <>
      {/* Pending Approvals Title */}
      <div className="text-black text-2xl font-bold font-['Montserrat'] mt-8 mb-4 text-center md:text-left">
        Total Revenue
      </div>

      {/* Pending Approvals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
         <NavLink onClick={() => card1(3)}>
        <div className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
          <img src={new1} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold text-center">Total Revenue</div>
          <div className="text-black text-2xl font-bold">87</div>
        </div>
        </NavLink>
        {/* Approval Card 2 */}
        <div className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
          <img src={IconCoins_04} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold text-center">Current Month Revenue</div>
          <div className="text-black text-2xl font-bold">20</div>
        </div>
      </div>
   </>
  )
}

export default TotalRevenue