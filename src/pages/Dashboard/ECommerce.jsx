import React, { useState, useEffect } from 'react';

import PendingApproval from './PendingApproval';
import TotalRevenue from './TotalRevenue';
import TotalUsers from './TotalUsers';
import UserTable from '../../components/DashBoardData/UserTable';
import ProductTable from '../../components/DashBoardData/ProductTable';
import RevenueTable from '../../components/DashBoardData/RevenueTable';

const ECommerce = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardNumber) => {
    setSelectedCard(cardNumber === selectedCard ? null : cardNumber);
  };


  useEffect(() => {   
    setSelectedCard(null);
  }, []); 

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-30px]">
      {selectedCard === 1 && (
        <>
          <UserTable card1={handleCardClick}/>
        </>
      )}
      {selectedCard === 2 && (
        <>
          <ProductTable card1={handleCardClick}/>
        </>
      )}
      {selectedCard === 3 && (
        <>
          <RevenueTable />
        </>
      )}
      {selectedCard === null && (
        <>
          <TotalUsers card1={handleCardClick} />
          <PendingApproval card1={handleCardClick}/>
          <TotalRevenue card1={handleCardClick} />
        </>
      )}
    </div>
  );
};

export default ECommerce;