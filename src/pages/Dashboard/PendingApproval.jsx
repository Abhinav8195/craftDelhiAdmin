import React from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import IconCube_02 from '../../assets/images/IconCube_02.png';
import IconImageIndentRight from '../../assets/images/IconImageIndentRight.png';
import IconCoins_04 from '../../assets/images/IconCoins_04.png';
import new1 from '../../assets/images/new1.png'
import { NavLink } from 'react-router-dom';


const PendingApproval = ({card1}) => {
  return (
   
        <>
         <div className="text-black text-2xl font-bold font-['Montserrat'] mt-8 mb-4 text-center md:text-left">
           Pending Approvals
         </div>
   
         {/* Pending Approvals Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <NavLink onClick={() => card1(2)}>
           <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
             <img src={IconCube_02} alt="Logo" className="w-10 h-10" />
             <div className="text-black text-base font-bold text-center">Products Pending Approval</div>
             <div className="text-black text-2xl font-bold">20</div>
           </div>
   </NavLink>
           {/* Approval Card 2 */}
           <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
             <img src={IconImageIndentRight} alt="Logo" className="w-10 h-10" />
             <div className="text-black text-base font-bold text-center">Products Pending Actions</div>
             <div className="text-black text-2xl font-bold">20</div>
           </div>
         </div>
        </>
  )
}

export default PendingApproval