import React, { useState, useEffect } from "react";
import axios from "axios";
import IconUserCheck_01 from "../../assets/images/IconUserCheck_01.png";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";
import BuyerDelete from "../buyerManagement/BuyerDelete";
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
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/seller-view`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.success) {
          const sellers = res.data.data.map((seller) => ({
            userId: seller.user_id,
            name: `${seller.first_name} ${seller.last_name}`,
            email: seller.email,
            status: seller.user_approval, // store as number (0,1,2)
            phone: seller.phone_number,
            city: seller.office_address || "N/A",
            ...seller,
          }));
          setUpdatedUsers(sellers);
        }
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  const openDeleteModal = (user) => {
    setDeleteUser(user);
  };
  const closeDeleteModal = () => {
    setDeleteUser(null);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSelectStatus = async (index, newStatusValue) => {
    const prevStatus = updatedUsers[index].status;
    const newUsers = [...updatedUsers];
    newUsers[index].status = newStatusValue;
    setUpdatedUsers(newUsers);
    setDropdownOpen(null);

    try {
      const token = localStorage.getItem("craftdelhiadmin_token");
      const sellerId = newUsers[index].userId;

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/update-seller-approval`,
        {
          seller_id: sellerId,
          user_approval: newStatusValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success(
          `Seller status updated to ${
            newStatusValue === 0
              ? "Pending"
              : newStatusValue === 1
              ? "Approved"
              : "Rejected"
          }`
        );
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
          data: { reason, description },
        }
      );

      if (res.data && res.data.success) {
        toast.success("Seller account deleted successfully");
        setUpdatedUsers((prev) =>
          prev.filter((u) => u.userId !== DeleteUser.userId)
        );
        closeDeleteModal();
      } else {
        toast.error(res.data?.message || "Failed to delete seller");
      }
    } catch (error) {
      console.error("❌ Error deleting seller:", error);
      toast.error("Error deleting seller");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "bg-yellow-300" };
      case 1:
        return { text: "Approved", color: "bg-green-400" };
      case 2:
        return { text: "Rejected", color: "bg-red-400" };
      default:
        return { text: "Unknown", color: "bg-gray-300" };
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-1 mt-5 lg:mt-[30px]">
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

            {/* Search Box */}
            <div className="relative w-full sm:w-[239px]">
              <input
                placeholder="Search"
                className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                <FaSearch />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full justify-start items-start gap-px inline-flex overflow-auto">
          {/* User ID */}
          <div className="w-[130px] flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="User ID" />
            {updatedUsers.map((user, index) => (
              <TableCell key={index} text={user.userId} />
            ))}
          </div>

          {/* Name */}
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="Name" />
            {updatedUsers.map((user, index) => (
              <TableCell key={index} text={user.name} />
            ))}
          </div>

          {/* Email */}
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="Email Address" />
            {updatedUsers.map((user, index) => (
              <TableCell key={index} text={user.email} />
            ))}
          </div>

          {/* Phone */}
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="Phone Number" />
            {updatedUsers.map((user, index) => (
              <TableCell key={index} text={user.phone} />
            ))}
          </div>

          {/* City */}
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="City" />
            {updatedUsers.map((user, index) => (
              <TableCell key={index} text={user.city} />
            ))}
          </div>

          {/* Status */}
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-px inline-flex">
            <TableHeader title="Status" />
            {updatedUsers.map((user, index) => {
              const { text, color } = getStatusInfo(user.status);
              return (
                <div
                  key={index}
                  className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex"
                >
                  <div
                    className={`p-1 rounded-sm justify-center items-center gap-2.5 flex ${color}`}
                  >
                    <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">
                      {text}
                    </div>
                  </div>
                  <div className="relative w-4 h-4">
                    <IoIosArrowDown onClick={() => toggleDropdown(index)} />
                    {dropdownOpen === index && (
                      <div className="absolute left-0 right-0 top-full z-50 bg-white border border-[#e0e4f4] mt-1 rounded w-24 shadow-md">
                        <div
                          className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-xs"
                          onClick={() => handleSelectStatus(index, 1)}
                        >
                          Approved
                        </div>
                        <div
                          className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-xs"
                          onClick={() => handleSelectStatus(index, 2)}
                        >
                          Rejected
                        </div>
                        <div
                          className="px-4 py-2 cursor-pointer hover:bg-[#e0e4f4] text-[10px] sm:text-xs"
                          onClick={() => handleSelectStatus(index, 0)}
                        >
                          Pending
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="grow shrink basis-0 flex-col justify-center items-center gap-px inline-flex">
            <TableHeader title="Actions" />
            {updatedUsers.map((user, index) => (
              <div
                key={index}
                className="h-[88px] gap-5 p-3 bg-white justify-center items-center inline-flex"
              >
                <button
                  className="w-4 h-4 relative overflow-hidden"
                  onClick={() => card1(user)}
                >
                  <LuPenLine />
                </button>
                <button
                  className="w-4 h-4 relative overflow-hidden "
                  onClick={() => openDeleteModal(user)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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

const TableHeader = ({ title }) => (
  <div className="self-stretch p-3 h-10 sm:h-12 bg-[#36234e] justify-start items-center gap-3 inline-flex">
    <div className="text-white text-[8px] sm:text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
      {title}
    </div>
  </div>
);

const TableCell = ({ text }) => (
  <div className="h-[88px] p-3 bg-white justify-start items-center gap-3 inline-flex">
    <div className="text-black text-[10px] font-medium font-['Montserrat'] leading-3">
      {text}
    </div>
  </div>
);

const DateInputField = ({ label, name, value, onChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="date"
        className="w-full h-10 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SellerTable;
