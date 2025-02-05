import React, { useState } from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDelete from '../buyerManagement/BuyerDelete';
import { IoIosAddCircle } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import AddPayment from './AddPayment';
import EditPayment from './EditPayment';
import PaymentDelete from './PaymentDelete';


const dummyData = [
    {
        id: "P001",
        orderId: "O001",
        seller: "John Doe",
        price: "$120",
        date: "12 Jan 2024",
        status: "Paid",
      },
      {
        id: "P002",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
      {
        id: "P003",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
      {
        id: "P004",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
      {
        id: "P005",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
      {
        id: "P006",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
      {
        id: "P007",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },

      {
        id: "P008",
        orderId: "O002",
        seller: "Jane Smith",
        price: "$250",
        date: "14 Jan 2024",
        status: "Unpaid",
      },
];

const PaymentTable = ({card1}) => {
    const [dropdownOpen, setDropdownOpen] = useState(null); 
  const [updatedUsers, setUpdatedUsers] = useState(dummyData); 
  const [DeleteUser, setDeleteUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [paymnetModal, setPaymentModal] = useState(null);
  const [EditModal, setEditModal] = useState(null);
 

  const openDeleteModal=(user)=>{
    setDeleteUser(user);
  }
  const closeDeleteModal = () => {
    setDeleteUser(null);
  };
 
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index); 
  };
  const openPaymentModal = (user) => {
    console.log('Opening modal for:', user); // Debugging line
    setPaymentModal(user); // Ensure this triggers correctly
};

const closePaymentModal = () => {
    setPaymentModal(null); 
};

const openEditPayment=(user)=>{
    setEditModal(user);
}

const closeEditModal = () => {
    setEditModal(null); 
};


   const handleSelectStatus = (index, status) => {
      const newUsers = [...updatedUsers];
      newUsers[index].status = status; // Update the status of the selected user
      setUpdatedUsers(newUsers);
      setDropdownOpen(null); // Close the dropdown after selecting a status
    };
  
     const [statusColors, setStatusColors] = useState({
        Refunded: '#ffc600',
        Paid: '#69d297',
        Unpaid: '#fe0000'
      });
  
  return (
    <div className="px-4 md:px-8 lg:px-1 mt-0 lg:mt-[-30px]">
      {/* Table Section */}
      <div className="flex flex-col gap-3 overflow-auto w-full min-h-screen">
 <div className="w-full flex flex-wrap justify-between items-center gap-3">
  <div className="text-black text-2xl font-bold w-full sm:w-auto">Payment List's</div>
  </div>
  {/* Dropdown और Search Input Flex */}
  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-start">
  <div className="w-full sm:w-[206px] mb-2 sm:mb-0">
    <DateInputField 
      label="Select Date" 
      name="selectedDate" 
      value={selectedDate} 
      onChange={(e) => setSelectedDate(e.target.value)} 
    />
  </div>

  {/* Dropdown */}
  <div className="w-full sm:w-[206px] mb-2 sm:mb-0">
    <select className="w-full h-10 text-xs bg-white border border-gray-300 rounded px-2">
      <option value="1">Paid/Unpaid</option>
      <option value="Paid">Paid</option>
      <option value="Unpaid">Unpaid</option>
    </select>
  </div>

  {/* Search Box */}
  <div className="relative w-full sm:w-[239px] mb-2 sm:mb-0">
    <input
      placeholder="Search"
      className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
      <FaSearch />
    </div>
  </div>

  {/* Add New Payment Button */}
  <div onClick={() => openPaymentModal('user')} className="ml-auto h-10 p-4 bg-[#024a63] rounded border border-white justify-center items-center gap-3 inline-flex overflow-hidden mt-2 sm:mt-0">
    <div className="w-4 h-4 relative overflow-hidden text-white">
      <IoIosAddCircle />
    </div>
    <div className="text-center text-white text-sm font-medium font-['Montserrat'] leading-none">
      Add New Payment
    </div>
  </div>
</div>


 
 





        {/* Table Headers */}
        <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          <div className="w-[130px] flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Payment id</div>
            </div>
            {/* Table Rows */}
            {dummyData.map((user, index) => (
            <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.id}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Order id</div>
            </div>
            {dummyData.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.orderId}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Seller name</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.seller}</div>
              </div>
            ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Total Price</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.price}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Date</div>
            </div>
            {dummyData.map((user, index) => (
             <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
<div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.date}</div>
              </div>
            ))}
          </div>

          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
              <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Payment STATUS</div>
            </div>
           {updatedUsers.map((user, index) => (
                                      <div key={index} className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
                                        <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex `} style={{ backgroundColor: statusColors[user.status] }} >
                                          <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                                        </div>
                                        <div className="w-4 h-4 relative ">
                                          <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                                       
                        
                                        
                                        {dropdownOpen === index && (
                                          <div className="absolute left-0 right-0 top-full z-50 bg-white border border-[#e0e4f4] mt-1 rounded w-24 shadow-md">
                                          <div 
                                            className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm"
                                            onClick={() => handleSelectStatus(index, 'Paid')}
                                          >
                                              Paid
                                            </div>
                                            <div 
                                              className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm" 
                                              onClick={() => handleSelectStatus(index, 'Unpaid')}
                                            >
                                              Unpaid
                                            </div>
                                            <div 
                                              className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-sm" 
                                              onClick={() => handleSelectStatus(index, 'Refunded')}
                                            >
                                              Refunded
                                            </div>
                                          </div>
                                        )}
                                         </div>
                                      </div>
                                    ))}
          </div>
          <div className="grow shrink basis-0 flex-col justify-center items-center gap-px inline-flex">
  <div className="self-stretch p-3 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">ACTIONS</div>
  </div>
  {dummyData.map((user, index) => (
    <div key={index} className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex">
      <button className="w-4 h-4 relative overflow-hidden" onClick={() => openEditPayment(user)}>
        <LuPenLine  />
      </button>
      <button className="w-4 h-4 relative overflow-hidden " onClick={() => openDeleteModal(user)}>
        <FaTrash />
      </button>
    </div>
  ))}
</div>

        </div>
      </div>

    {EditModal&&(
    <EditPayment  user={EditModal} close={closeEditModal}/>
    )}
      {paymnetModal && (
                <AddPayment user={paymnetModal} close={closePaymentModal} />
            )}

{DeleteUser && (
  
      <PaymentDelete user={DeleteUser} close={closeDeleteModal} />


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

export default PaymentTable;
