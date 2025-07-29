import React, { useEffect, useState } from 'react';
import IconUserCheck_01 from '../../assets/images/IconUserCheck_01.png';
import IconShoppingBag_02 from '../../assets/images/IconShoppingBag_02.png';
import IconFaceContent from '../../assets/images/IconFaceContent.png';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const TotalUsers = ({ card1 }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("craftdelhiadmin_token");

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status) {
        setStats(response.data.data);
      } else {
        setStats(null);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-10 text-red-500">Unable to load dashboard data.</div>;
  }

  return (
    <>
     <div className="text-black text-2xl font-bold font-['Montserrat'] mb-3 text-center md:text-left">
        Total Users
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink onClick={() => card1(1)}>
          <div className="h-[180px] p-5 bg-gradient-to-b from-[#ffe2e6] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
            <img src={IconUserCheck_01} alt="User Icon" className="w-10 h-10" />
            <div className="text-black text-base font-bold">Total Number Of Users</div>
            <div className="text-black text-2xl font-bold">{stats.total_users}</div>
            <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
          </div>
        </NavLink>

        <div className="h-[180px] p-5 bg-gradient-to-b from-[#fff4de] to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
          <img src={IconShoppingBag_02} alt="Seller Icon" className="w-10 h-10" />
          <div className="text-black text-base font-bold">Total Number Of Active Sellers</div>
          <div className="text-black text-2xl font-bold">{stats.active_sellers}</div>
          <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
        </div>

       
        <div className="h-[180px] p-5 bg-gradient-to-b from-green-100 to-white rounded-xl border border-[#d9d9d9] flex flex-col justify-between">
          <img src={IconFaceContent} alt="Buyer Icon" className="w-10 h-10" />
          <div className="text-black text-base font-bold">Total Number Of Active Buyers</div>
          <div className="text-black text-2xl font-bold">{stats.active_buyers}</div>
          <div className="text-[#2d53d8] text-xs font-bold">+8 from yesterday</div>
        </div>
      </div>
    </>
  );
};

export default TotalUsers;
