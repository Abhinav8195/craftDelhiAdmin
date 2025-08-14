  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
  import { IoIosArrowDown } from "react-icons/io";
  import { FaSearch } from "react-icons/fa";
  import { NavLink } from 'react-router-dom';
  import { FaRegEye } from "react-icons/fa";
  import { FaTrash } from "react-icons/fa6";
  import { LuPenLine } from "react-icons/lu";
  import BuyerDelete from '../buyerManagement/BuyerDelete';
  import "react-datepicker/dist/react-datepicker.css";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  const SellerTable = ({ card1 }) => {
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [DeleteUser, setDeleteUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
  
  useEffect(() => {
      const fetchSellers = async () => {
        try {
          const token = localStorage.getItem("craftdelhiadmin_token"); 
          const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/seller-view`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data && res.data.success) {
            const sellers = res.data.data.map((seller) => ({
              userId: seller.user_id,
              name: `${seller.first_name} ${seller.last_name}`,
              email: seller.email,
              status: "Approved", 
              phone: seller.phone_number,
              city: seller.office_address || "N/A",
              ...seller
            }));
            setUpdatedUsers(sellers);
          }
        } catch (error) {
          console.error("Error fetching sellers:", error);
        }
      };

      fetchSellers();
    }, []);

    const openDeleteModal=(user)=>{
      setDeleteUser(user);
    }
    const closeDeleteModal = () => {
      setDeleteUser(null);
    };
  
    const toggleDropdown = (index) => {
      setDropdownOpen(dropdownOpen === index ? null : index); 
    };

    
  const handleSelectStatus = async (index, status) => {
    const prevStatus = updatedUsers[index].status; 
    const newUsers = [...updatedUsers];
    newUsers[index].status = status;
    setUpdatedUsers(newUsers);
    setDropdownOpen(null);

    try {
      const token = localStorage.getItem("craftdelhiadmin_token");
      const sellerId = newUsers[index].userId;
      const userApproval = status === "Approved" ? 1 : 2;

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/update-seller-approval`,
        {
          seller_id: sellerId,
          user_approval: userApproval,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success(`Seller status updated to ${status}`);
      } else {
        toast.error(res.data?.message || "Failed to update status");
        const rollbackUsers = [...updatedUsers];
        rollbackUsers[index].status = prevStatus;
        setUpdatedUsers(rollbackUsers);
      }
    } catch (error) {
      toast.error("Error updating seller status");
      const rollbackUsers = [...updatedUsers];
      rollbackUsers[index].status = prevStatus;
      setUpdatedUsers(rollbackUsers);
      console.error("❌ Error updating status:", error);
    }
  };

    const handleDeleteSeller = async (reason, description) => {
    try {
      const token = localStorage.getItem("craftdelhiadmin_token");
      const res = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/delete-sellerbyadmin/${DeleteUser.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { reason, description } 
        }
      );

      if (res.data && res.data.success) {
        toast.success("Seller account deleted successfully");
        setUpdatedUsers((prev) => prev.filter((u) => u.userId !== DeleteUser.userId));
        closeDeleteModal();
      } else {
        toast.error(res.data?.message || "Failed to delete seller");
      }
    } catch (error) {
      console.error("❌ Error deleting seller:", error);
      toast.error("Error deleting seller");
    }
  };

    return (
      <div className="px-4  md:px-8 lg:px-1 mt-5 lg:mt-[30px]">
      
        <div className="h-[589px] flex flex-col gap-3 overflow-auto w-full">
    <div className="w-full flex flex-wrap justify-between items-center gap-3">
      <div className="text-black text-2xl font-bold">Total Seller's</div>
      
  
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
        <div className="w-full sm:w-[206px]">
    <select className="w-full h-10 text-[10px] sm:text-xs bg-white border border-gray-300 rounded px-2">
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
      User ID
    </div>
  </div>

              {/* Table Rows */}
              {updatedUsers.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
  <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.userId}</div>
                </div>
              ))}
            </div>

            <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Name
    </div>
  </div>

              {updatedUsers.map((user, index) => (
                <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
  <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.name}</div>
                </div>
              ))}
            </div>

            <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
      Email Address
    </div>
  </div>

              {updatedUsers.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
  <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.email}</div>
                </div>
              ))}
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    Phone Number
    </div>
  </div>

              {updatedUsers.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
  <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.phone}</div>
                </div>
              ))}
            </div>

            <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
    City
    </div>
  </div>

              {updatedUsers.map((user, index) => (
              <div class="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
  <div class="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.city}</div>
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
                  <div className={`p-1 rounded-sm justify-center items-center gap-2.5 flex ${user.status === 'Approved' ? 'bg-[#69d297]' : 'bg-[#fe0000]'}`}>
                    <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">{user.status}</div>
                  </div>
                  <div className="relative w-4 h-4">
    <IoIosArrowDown onClick={() => toggleDropdown(index)} />
    
    {/* Dropdown */}
    {dropdownOpen === index && (
      <div className="absolute left-0 right-0 top-full z-50 bg-white border border-[#e0e4f4] mt-1 rounded w-24 shadow-md">
        <div 
          className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-xs"
          onClick={() => handleSelectStatus(index, 'Approved')}
        >
          Approved
        </div>
        <div 
          className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-xs"
          onClick={() => handleSelectStatus(index, 'Rejected')}
        >
          Rejected
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

    {updatedUsers.map((user, index) => (
      <div key={index} className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex">
        <button className="w-4 h-4 relative overflow-hidden" onClick={() => card1(user)}>
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


        {/* {selectedUser && (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg" onClick={closeModal} />
      <div className="relative w-[883px] h-[712px] p-5 bg-white rounded-2xl shadow-2xl border border-[#d9d9d9] flex flex-col justify-start items-start gap-4 z-50">
        <BuyerDetails user={selectedUser} close={closeModal} />
      </div>
    </div>
  )} */}
  {DeleteUser && (
        <BuyerDelete 
          user={DeleteUser} 
          close={closeDeleteModal} 
          onDelete={handleDeleteSeller} 
        />
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

  export default SellerTable;
