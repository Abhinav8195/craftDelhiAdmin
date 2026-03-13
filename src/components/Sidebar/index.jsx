import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

// Import Lucide Icons (to replace exact legacy images with clean vectors)
import { 
  BarChart2, 
  Users, 
  UserCheck, 
  Package, 
  CreditCard, 
  MessageSquare, 
  Grid, 
  Image as ImageIcon, 
  Layers, 
  LogOut,
  X,
  User
} from "lucide-react";

import iconImage from '../../assets/images/icon.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen, setIsAuthenticated }) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState(null);

  const confirmLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5", // Indigo-600
      cancelButtonColor: "#ef4444", // Red-500
      confirmButtonText: "Yes, Logout",
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
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

        navigate('/');
      }
    });
  };

  const handleLinkClick = () => {
    // On mobile, close sidebar after clicking a link
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

  // Close on click outside (Mobile primarily)
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

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Reusable NavItem component for consistency
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={handleLinkClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 transition-transform duration-200 ${
              isActive ? "text-indigo-600 scale-110" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-50 flex flex-col h-screen w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 p-1 shrink-0 overflow-hidden">
               {/* Keep original logo if needed or replace with clean icon */}
               <img src={iconImage} alt="Logo" className="w-full h-full object-contain" />
             </div>
             <div className="flex flex-col">
                <span className="text-[20px] font-bold text-gray-900 leading-none mb-1 font-['Cinzel'] tracking-wide">CRAFT</span>
                <span className="text-[14px] font-bold text-indigo-600 leading-none font-['Cormorant Garamond'] tracking-widest">DELHI</span>
             </div>
          </div>
          
          {/* Mobile close button */}
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar flex flex-col gap-1.5">
          <NavItem to="/" icon={BarChart2} label="Dashboard" />
          <NavItem to="/buyer-management" icon={Users} label="Buyer Management" />
          <NavItem to="/seller-management" icon={UserCheck} label="Seller Management" />
          <NavItem to="/product-management" icon={Package} label="Product Management" />
          <NavItem to="/order-management" icon={Grid} label="Order Management" />
          <NavItem to="/payment-management" icon={CreditCard} label="Payment Management" />
          
          <div className="my-2 mx-4 h-px bg-gray-100" /> {/* Divider */}
          <div className="px-6 py-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Store Content</h4>
          </div>

          <NavItem to="/giftcategory" icon={Layers} label="Gift Category" />
          <NavItem to="/banner" icon={ImageIcon} label="Banner Manager" />
          <NavItem to="/manage-categories" icon={Grid} label="Manage Categories" />
          <NavItem to="/chat" icon={MessageSquare} label="Messages" />
        </div>

        {/* USER PROFILE SECTION */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/50 shrink-0">
          <div 
            onClick={confirmLogout} 
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden shrink-0 border-2 border-white shadow-sm flex items-center justify-center relative">
               <div className="absolute inset-0 bg-indigo-200 animate-ping opacity-20 rounded-full"></div>
               <User className="w-5 h-5 text-indigo-600 relative z-10 animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Logged in as</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {userName || 'Admin User'}
              </p>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors shrink-0">
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
