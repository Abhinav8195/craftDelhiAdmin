import React, { useEffect, useState } from 'react'
import IconCoins_04 from '../../assets/images/IconCoins_04.png';
import new1 from '../../assets/images/new1.png'
import { NavLink } from 'react-router-dom';
import ProductTable from '../../components/Product/ProductTable';
import EditProduct from '../../components/Product/EditProduct';

const ProductManagement = () => {
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
          <EditProduct card1={handleCardClick} />
        </>
      )}
     
     {selectedCard === null && (
        <>
   
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
             <NavLink>

            <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col  justify-center gap-[15px] items-center text-center">
              <div className="text-black text-base font-bold text-center">Total Number Of Products</div>
              <div className="text-black text-2xl font-bold">1200</div>
            </div>
            </NavLink>
            <div className="h-[200px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-center gap-[15px] text-center">
              <div className="text-black text-base font-bold text-center">Pending Products</div>
              <div className="text-black text-2xl font-bold">211</div>
            </div>
          </div>
          <ProductTable card1={handleCardClick} />
         

          </>
)}

          </>
  )
}

export default ProductManagement