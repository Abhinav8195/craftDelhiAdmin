import React, { useState } from 'react';
import IconCube_02 from '../../assets/images/IconCube_02.png';
import IconImageIndentRight from '../../assets/images/IconImageIndentRight.png';
import IconSearchRefraction from '../../assets/images/IconSearchRefraction.png';
import sample from '../../assets/images/sample.png';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

// Dummy data with product images and other details
const dummyData = [
  { userId: '01', name: 'Product A', productImage: sample, seller: 'John Doe', status: 'Pending' },
  { userId: '02', name: 'Product B', productImage: sample, seller: 'Jane Smith', status: 'Approved' },
  { userId: '03', name: 'Product C', productImage: sample, seller: 'Sam Wilson', status: 'Pending' },
  { userId: '04', name: 'Product D', productImage: sample, seller: 'Lucy Brown', status: 'Rejected' }
];


const ProductTable = () => {


     const [dropdownOpen, setDropdownOpen] = useState(null); 
      const [updatedUsers, setUpdatedUsers] = useState(dummyData); 
    
     
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
        Pending Approvals
      </div>

      {/* Pending Approvals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Approval Card 1 */}
        <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
          <img src={IconCube_02} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold text-center">Products Pending Approval</div>
          <div className="text-black text-2xl font-bold">20</div>
        </div>

        {/* Approval Card 2 */}
        <div className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between">
          <img src={IconImageIndentRight} alt="Logo" className="w-10 h-10" />
          <div className="text-black text-base font-bold text-center">Products Pending Actions</div>
          <div className="text-black text-2xl font-bold">20</div>
        </div>
      </div>
      </div>


     <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
     <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
      <div className="w-full flex flex-wrap justify-between items-center gap-3">
        <div className="text-black text-2xl font-bold"> Products Pending Approval</div>
        
       
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
                <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
                  <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">PRODUCT ID</div>
                </div>
                {/* Table Rows */}
                {products.map((user, index) => (
                <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
    <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.userId}</div>
                  </div>
                ))}
              </div>
    
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
                <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
                  <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">PRODUCT NAME</div>
                </div>
                {products.map((user, index) => (
                  <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
    <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.name}</div>
                  </div>
                ))}
              </div>
    
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
                <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
                  <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">PRODUCT IMAGE</div>
                </div>
                {products.map((product, index) => (
                 <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                   <div className="w-16 h-16 justify-center items-center flex">
                     <img
                       src={product.productImage}
                       alt={product.name}
                       className="w-16 h-16 rounded-full"
                     />
                   </div>
                 </div>
               ))}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
                <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
                  <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">SELLER NAME</div>
                </div>
                {products.map((user, index) => (
                 <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
    <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.seller}</div>
                  </div>
                ))}
              </div>
    
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
                <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
                  <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">STATUS</div>
                </div>
                {updatedUsers.map((user, index) => (
                  <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                    <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex `} style={{ backgroundColor: statusColors[user.status] }} >
                      <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                    </div>
                    <div className="w-4 h-4 relative overflow-hidden">
                      <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                    </div>
    
                    
                    {dropdownOpen === index && (
  <div className="absolute right-0 bg-white border border-gray-300 rounded w-24 z-50 shadow-md">
    <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectStatus(index, 'Approved')}>Approved</div>
    <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectStatus(index, 'Rejected')}>Rejected</div>
    <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectStatus(index, 'Pending')}>Pending</div>
  </div>
)}

                  </div>
                ))}
              </div>
             
            </div>
          </div>
        </div>

    </>
  );
};

export default ProductTable;
