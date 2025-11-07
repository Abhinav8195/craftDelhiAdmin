import React, { useEffect, useState } from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
};

const tableContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const tableRow = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const UserTable = ({ card1, stats }) => {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [filterRole, setFilterRole] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("craftdelhiadmin_token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/total-users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      }
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    let updated = [...users];
    if (filterRole === "buyer") {
      updated = updated.filter(u => u.role === "buyer");
    } else if (filterRole === "seller") {
      updated = updated.filter(u => u.role === "seller");
    } else if (filterRole === "trash") {
      updated = updated.filter(u => u.account_trashed === 1);
    }

  
    if (searchTerm.trim() !== "") {
      updated = updated.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(updated);
  }, [filterRole, searchTerm, users]);

  return (
    <>
      <div className="px-4 md:px-8 lg:px-1">
        <div className="text-black text-2xl font-bold mb-3">Total Users</div>

       
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={tableContainer}
        >

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => card1(null)}
            className="cursor-pointer h-[180px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between"
          >
            <img src={IconUserCheck_01} className="w-10 h-10" />
            <div className="text-black text-base font-bold">Total Number Of Users</div>
            <div className="text-black text-2xl font-bold">{stats?.total_users}</div>
            <div className="text-[#2d53d8] text-xs font-bold">Live Data</div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            className="h-[180px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between"
          >
            <img src={IconShoppingBag_02} className="w-10 h-10" />
            <div className="text-black text-base font-bold">Total Active Sellers</div>
            <div className="text-black text-2xl font-bold">{stats?.active_sellers}</div>
            <div className="text-[#2d53d8] text-xs font-bold">Live Data</div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            className="h-[180px] p-5 bg-gradient-to-b from-green-100 to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between"
          >
            <img src={IconFaceContent} className="w-10 h-10" />
            <div className="text-black text-base font-bold">Total Active Buyers</div>
            <div className="text-black text-2xl font-bold">{stats?.active_buyers}</div>
            <div className="text-[#2d53d8] text-xs font-bold">Live Data</div>
          </motion.div>
        </motion.div>
      </div>

      
      <motion.div
        className="px-4 md:px-8 lg:px-1 mt-8 overflow-auto"
        variants={tableContainer}
        initial="hidden"
        animate="visible"
      >

       
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="text-black text-xl font-bold">Total Users</div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="w-full sm:w-[206px] h-10 text-xs bg-white border border-gray-300 rounded px-2"
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Buyer/Seller/Trash</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="trash">Trash</option>
            </select>

            <div className="relative w-full sm:w-[239px]">
              <input
                placeholder="Customer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 text-black text-xs border border-gray-300 rounded px-3 pr-10"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
            </div>
          </div>
        </div>

     
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#36234e] text-white">
              <tr>
                <th className="p-3 text-xs uppercase tracking-wider">User ID</th>
                <th className="p-3 text-xs uppercase tracking-wider">Name</th>
                <th className="p-3 text-xs uppercase tracking-wider">Role</th>
                <th className="p-3 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <motion.tbody variants={tableContainer}>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={index}
                  variants={tableRow}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-[11px]">{user.user_id}</td>

                  <td className="p-3 text-[11px]">
                    {user.first_name} {user.last_name}
                  </td>

                  <td className="p-3 text-[11px] capitalize">
                    {user.role}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-semibold text-white ${
                        user.account_trashed === 1
                          ? "bg-[#6b7280]"
                          : user.user_status === 1
                          ? "bg-[#69d297]"
                          : "bg-[#fe0000]"
                      }`}
                    >
                      {user.account_trashed === 1
                        ? "Trash"
                        : user.user_status === 1
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default UserTable;
