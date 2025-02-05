import React, { useState } from 'react';
import IconCoins_04 from '../../assets/images/IconCoins_04.png';
import new1 from '../../assets/images/new1.png'
import IconSearchRefraction from '../../assets/images/IconSearchRefraction.png';
import { FaSearch } from "react-icons/fa";

// Dummy data with product images and other details
const dummyData = [
  { userId: '01', name: 'Product A', amount: '5000', date: '11-January-2025',},
  { userId: '02', name: 'Product B', amount: '5000', date: '11-January-2025', },
  { userId: '03', name: 'Product C', amount: '5000', date: '11-January-2025',},
  { userId: '04', name: 'Product D', amount: '5000', date: '11-January-2025', }
];

const RevenueTable = () => {
  const [statusColors, setStatusColors] = useState({
    Pending: '#ffc600',
    Approved: '#69d297',
    Rejected: '#fe0000'
  });

  const [products, setProducts] = useState(dummyData);

  const handleStatusChange = (index, newStatus) => {
    const updatedProducts = [...products];
    updatedProducts[index].status = newStatus;

    // Change color based on the new status
    const newColor = {
      Pending: '#ffc600',
      Approved: '#69d297',
      Rejected: '#fe0000'
    };

    setProducts(updatedProducts);
    setStatusColors(newColor);
  };

  return (
    <>
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-60px] ">
      <div className="text-black text-2xl font-bold font-['Montserrat'] mt-8 mb-4 text-center md:text-left">
             Total Revenue
           </div>
     
           {/* Pending Approvals Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
             
             <div className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
               <img src={new1} alt="Logo" className="w-10 h-10" />
               <div className="text-black text-base font-bold text-center">Total Revenue</div>
               <div className="text-black text-2xl font-bold">87</div>
             </div>
             
             {/* Approval Card 2 */}
             <div className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
               <img src={IconCoins_04} alt="Logo" className="w-10 h-10" />
               <div className="text-black text-base font-bold text-center">Current Month Revenue</div>
               <div className="text-black text-2xl font-bold">20</div>
             </div>
           </div>
           </div>

<div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      {/* Table Section */}
       <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
            <div className="w-full flex flex-wrap justify-between items-center gap-3">
              <div className="text-black text-2xl font-bold"> Total Revenue</div>
              
             
              <div className="flex gap-2 w-full sm:w-auto">
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
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Transaction id
  </div>
</div>

            {/* Table Rows */}
            {dummyData.map((user, index) => (
            <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.userId}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Seller Name
  </div>
</div>

            {dummyData.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.name}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Amount
  </div>
</div>

            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.amount}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Date
  </div>
</div>

      {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.date}</div>
              </div>
            ))}
    </div>

         
        </div>
      </div>
    </div>

    </>
   
   
  );
};

export default RevenueTable;
