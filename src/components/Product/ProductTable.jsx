import React, { useState } from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDelete from '../buyerManagement/BuyerDelete';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sample from '../../assets/images/sample.png'
import ProductDelete from './ProductDelete';


const dummyData = [
  {
    no: '01',
    productid: 'John Doe',
    productname: 'admin@gmail.com',
    productimage: Sample,
    productcategory:'+911234567890',
    price:'1000',
    status:'Approved'
  },
  {
    no: '02',
    productid: 'Jane Smith',
    productname: 'admin@gmail.com',
    productimage: Sample,
     productcategory:'+911234567890',
      price:'1000',
      status:'Rejected'
  },
  {
    no: '03',
    productid: 'Sam Wilson',
    productname: 'admin@gmail.com',
    productimage: Sample,
     productcategory:'+911234567890',
      price:'1000',
      status:'Pending'
  },
  {
    no: '04',
    productid: 'Lucy Brown',
    productname: 'admin@gmail.com',
    productimage: Sample,
     productcategory:'+911234567890',
      price:'1000',
      status:'Approved'
  },
   {
    no: '04',
    productid: 'Lucy Brown',
    productname: 'admin@gmail.com',
    productimage: Sample,
     productcategory:'+911234567890',
      price:'1000',
      status:'Approved'
  }
];

const ProductTable = ({card1}) => {
    const [dropdownOpen, setDropdownOpen] = useState(null); 
  const [updatedUsers, setUpdatedUsers] = useState(dummyData); 
  const [DeleteProduct, setDeleteProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); 
 

  const openDeleteModal=(product)=>{
    setDeleteProduct(product);
  }
  const closeDeleteModal = () => {
    setDeleteProduct(null);
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

   const [statusColors, setStatusColors] = useState({
      Pending: '#ffc600',
      Approved: '#69d297',
      Rejected: '#fe0000'
    });

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[30px]">
      {/* Table Section */}
      <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
  <div className="w-full flex flex-wrap justify-between items-center gap-2">
    <div className="text-black text-2xl font-bold">Total Product's</div>
    
    {/* Dropdown और Search Input Flex */}
    <div className="flex gap-2 w-full sm:w-auto">
    <div className="w-full sm:w-[206px]">
    <DateInputField 
  label="Select Date" 
  name="selectedDate" 
  value={selectedDate} 
  onChange={(e) => setSelectedDate(e.target.value)} 
/>

          </div>
      {/* Dropdown */}
      
      <div className="w-full sm:w-[180px]">
  <select className="w-full h-10 text-[10px] bg-white border border-gray-300 rounded px-2">
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
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   NO #
  </div>
</div>

            {/* Table Rows */}
            {dummyData.map((user, index) => (
            <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.no}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Product ID
  </div>
</div>

            {dummyData.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.productid}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   Product name
  </div>
</div>

            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.productname}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   Product Image
  </div>
</div>

                {dummyData.map((product, index) => (
                 <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                   <div className="w-16 h-16 justify-center items-center flex">
                     <img
                       src={product.productimage}
                       alt={product.name}
                       className="w-16 h-16 rounded-full"
                     />
                   </div>
                 </div>
               ))}
              </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Product Category
  </div>
</div>

            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.productcategory}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Price
  </div>
</div>

            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.price}</div>
              </div>
            ))}
          </div>
         <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
         <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Status
  </div>
</div>

                         {updatedUsers.map((user, index) => (
                           <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                             <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex `} style={{ backgroundColor: statusColors[user.status] }} >
                               <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                             </div>
                             <div className="relative w-4 h-4">
                               <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                          
             
                             
                             {dropdownOpen === index && (
                                <div className="absolute left-0 right-0 top-full z-50 bg-white border border-[#e0e4f4] mt-1 rounded w-24 shadow-md">
                                <div 
                                  className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm"
                                  onClick={() => handleSelectStatus(index, 'Approved')}
                                >
                                   Approved
                                 </div>
                                 <div 
                                   className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm"
                                   onClick={() => handleSelectStatus(index, 'Rejected')}
                                 >
                                   Rejected
                                 </div>
                                 <div 
                                   className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm"
                                   onClick={() => handleSelectStatus(index, 'Pending')}
                                 >
                                   Pending
                                 </div>
                               </div>
                             )}
                             </div>
                           </div>
                         ))}
                       </div>
          <div className="grow shrink basis-0 flex-col justify-center items-center gap-px inline-flex">
          <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
  <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
   Actions
  </div>
</div>

  {dummyData.map((product, index) => (
    <div key={index} className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex">
      <button className="w-4 h-4 relative overflow-hidden" onClick={() => card1(1)}>
        <LuPenLine  />
      </button>
      <button className="w-4 h-4 relative overflow-hidden " onClick={() => openDeleteModal(product)}>
        <FaTrash />
      </button>
    </div>
  ))}
</div>

        </div>
      </div>


      {/* {selectedUser && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg" onClick={closeModal} />
    <div className="relative w-[883px] h-[712px] p-5 bg-white rounded-2xl shadow-2xl border border-[#d9d9d9] flex flex-col justify-start items-start gap-4 z-50">
      <BuyerDetails user={selectedUser} close={closeModal} />
    </div>
  </div>
)} */}
{DeleteProduct && (
  
      <ProductDelete user={DeleteProduct} close={closeDeleteModal} />


)}

    </div>
  );
};

const DateInputField = ({ label, name, value, onChange }) => {
    return (
      <div>
       
        <div className="relative w-full">
          <input
            type="date"
            className="w-full h-10 px-3  bg-white rounded border border-[#e0e4f4] text-xs"
            name={name}
            value={value}
            onChange={onChange}
          />
         
        </div>
      </div>
    );
  };

export default ProductTable;
