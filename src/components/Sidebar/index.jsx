import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import iconImage from '../../assets/images/icon.png';
import IconPresentationChart_01 from '../../assets/images/IconPresentationChart_01.png';
import IconUsersEdit from '../../assets/images/IconUsersEdit.png';
import IconUserCheck_02 from '../../assets/images/IconUserCheck_02.png';
import IconPackage from '../../assets/images/IconPackage.png';
import IconWallet_05 from '../../assets/images/IconWallet_05.png';
import IconCoinsHand from '../../assets/images/IconCoinsHand.png';
import i1active from '../../assets/images/i1active.png';
import buyeractive from '../../assets/images/buyeractive.png';
import selleractive from '../../assets/images/selleractive.png';
import payactive from '../../assets/images/payactive.png';
import orderactive from '../../assets/images/orderactive.png';
import packactive from '../../assets/images/packactive.png';
import users from '../../assets/images/user.png';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from "sweetalert2";


const Sidebar = ({ sidebarOpen, setSidebarOpen, setIsAuthenticated }) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const navigate = useNavigate();
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );
  const [userName, setUserName] = useState(null);

  const confirmLogout = () => {
  Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#024a63",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Logout",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('craftdelhiadmin_token');
      localStorage.removeItem('user');
      localStorage.removeItem('Adminname');
      localStorage.removeItem('craftdelhiadmin_tokenExpiry');

      if (setIsAuthenticated) {
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('storage'));
      }

      Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/');
    }
  });
};


  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('Adminname');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex overflow-x-hidden bg-[#ffffff] border border-[#D9D9D9] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{
        width: '280px',
        height: '100vh',
        padding: '16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexShrink: '0',
      }}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
          </svg>
        </button>
      </div>

      {/* SIDEBAR CONTENT */}
      <div className="margin-auto flex flex-col overflow-y-auto duration-300 ease-linear">
        <div className="w-[250px] h-[982px] p-4 bg-white flex-col justify-start items-start inline-flex overflow-hidden">
          {/* Sidebar Header */}
          <div className="self-stretch pr-3 pt-2 pb-4 justify-start items-start gap-3 inline-flex">
            <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start inline-flex">
              <div className="self-stretch py-1 bg-white justify-start items-center gap-1 inline-flex">
                <div className="w-[40.17px] h-[40.68px] relative">
                  <img src={iconImage} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="w-[1.86px] h-[38.40px] bg-[#024a63] rounded-sm"></div>
                <div className="w-[88px] h-[48.96px] relative">
                  <div className="w-[87px] h-[25.85px] left-0 top-0 absolute text-[#ee6f69] text-[24.89px] font-bold font-['Cinzel']">CRAFT</div>
                  <div className="left-0 top-[22.96px] absolute text-[#024a63] text-[21.85px] font-bold font-['Cormorant Garamond'] tracking-[5.90px]">DELHI</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Links */}
          <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex">
            <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? IconPresentationChart_01 : i1active} alt="Dashboard" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Dashboard
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink to="/buyer-management" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? buyeractive : IconUsersEdit} alt="Buyer Management" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Buyer Management
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink to="/seller-management" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? selleractive : IconUserCheck_02} alt="Seller Management" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Seller Management
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink to="/product-management" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? packactive : IconPackage} alt="Product Management" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Product Management
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink to="/order-management" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? orderactive : IconWallet_05} alt="Order Management" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Order Management
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink to="/payment-management" onClick={handleLinkClick} className={({ isActive }) => {
              const bgColor = isActive ? 'bg-[#024a63]' : '';
              return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
            }}>
              {({ isActive }) => (
                <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <img src={isActive ? payactive : IconCoinsHand} alt="Payment Management" className="w-full h-full object-cover" />
                  </div>
                  <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? 'text-[#ffffff]' : 'text-[black]'}`}>
                    Payment Management
                  </div>
                </div>
              )}
            </NavLink>

             <NavLink to="/chat"  onClick={handleLinkClick} className={({ isActive }) => {
    const bgColor = isActive ? "bg-[#024a63]" : "";
    return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
  }}>
     {({ isActive }) => (
              <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                <div className="w-5 h-5 relative overflow-hidden">
                  <img src={isActive? orderactive:IconWallet_05} alt="Order Management Icon" className="w-full h-full object-cover" />
                </div>
                <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? "text-[#ffffff]" : "text-[black]"}`}>Messages</div>
              </div>
            )}
            </NavLink>

            <NavLink to="/banner"  onClick={handleLinkClick} className={({ isActive }) => {
    const bgColor = isActive ? "bg-[#024a63]" : "";
    return `self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex ${bgColor}`;
  }}>
     {({ isActive }) => (
              <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
                <div className="w-5 h-5 relative overflow-hidden">
                  <img src={isActive? orderactive:IconWallet_05} alt="Order Management Icon" className="w-full h-full object-cover" />
                </div>
                <div className={`grow shrink basis-0 text-xs font-medium font-['Montserrat'] leading-none ${isActive ? "text-[#ffffff]" : "text-[black]"}`}>Banner</div>
              </div>
            )}
            </NavLink>
          </div>

          {/* Profile */}
          <div onClick={confirmLogout} className="self-stretch px-3 py-4 rounded-lg justify-start items-center gap-2 inline-flex cursor-pointer">
            <div className="grow shrink basis-0 h-5 justify-start items-center gap-3 flex">
              <div className="w-5 h-5 relative overflow-hidden">
                <img src={users} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="grow shrink basis-0 text-[#36234e] text-xs font-medium font-['Montserrat'] leading-tight">
              <span className="block">Welcome</span>
              <span className="block font-semibold text-sm">{userName || 'Admin'}</span>
            </div>
            </div>
            <div className="w-5 h-5 p-2.5 justify-center items-center gap-2 rounded-full inline-flex">
              <div className="w-5 h-5 rounded-full relative">
                <div className="w-5 h-5 absolute rounded-full ">
                  <IoIosArrowForward />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
