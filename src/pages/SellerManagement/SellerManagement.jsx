import React, { useEffect, useState } from 'react'
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import { NavLink } from 'react-router-dom';
import SellerTable from '../../components/sellerManagement/SellerTable';
import SellerEditProfile from '../../components/sellerManagement/SellerEditProfile';
import SellerController from '../../components/sellerManagement/SellerController';

const SellerManagement = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  
    const handleCardClick = (cardNumber) => {
      setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
    };
  
  
    useEffect(() => {   
      setSelectedCard(null);
    }, []); 
  return (
    <>
    {selectedCard === 1 && (
        <>
          <SellerController card1={handleCardClick} />
        </>
      )}

{selectedCard === null && (
        <>
        
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Card 1 */}
             <NavLink>
            <div className="h-[180px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col  justify-between items-center text-center">
               <img src={IconUserCheck_01} alt="Logo" className="w-10 h-10" />
               <div className="text-black text-base font-bold">Total Number Of Seller's</div>
               <div className="text-black text-2xl font-bold">87</div>
               {/* <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div> */}
             </div>
            </NavLink>
     
             {/* Card 2 */}
             <div className="h-[180px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between items-center text-center">
               <img src={IconShoppingBag_02} alt="Logo" className="w-10 h-10" />
               <div className="text-black text-base font-bold">Total Number Of Active Seller's</div>
               <div className="text-black text-2xl font-bold">2100</div>
               {/* <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div> */}
             </div>
     
             {/* Card 3 */}
             <div className="h-[180px] p-5 bg-gradient-to-b from-green-100 to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between items-center text-center">
               <img src={IconFaceContent} alt="Logo" className="w-10 h-10" />
               <div className="text-black text-base font-bold">Total Number Of Trashed Account </div>
               <div className="text-black text-2xl font-bold">200</div>
               {/* <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div> */}
             </div>
           </div>

           <SellerTable card1={handleCardClick}/>
           </>
)}
    </>
  )
}

export default SellerManagement