import { FaBell } from 'react-icons/fa';
import DropdownNotification from './DropdownNotification';
import { IoMdMenu } from "react-icons/io";
import { useState } from 'react';

const Header = ({ sidebarOpen, setSidebarOpen, pageTitle }) => {
  const [ShowNotification,setShowNotification] = useState(false)
  return (
    <>
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        
        {/* Hamburger Toggle BTN */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-2 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <IoMdMenu />
          </button>
        </div>

        {/* DashBoard text (Always visible) */}
        <div className="flex-grow flex justify-between items-center px-6 py-4">
          <div className="text-[#36234e] text-base font-bold font-['Montserrat'] leading-normal">
            {pageTitle}
          </div>
          
          {/* Notification Area */}
          <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotification(true)}
                className="relative flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 hover:bg-gray-200"
              >
                <FaBell className="text-gray-600 w-4 h-4" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
        </div>
      </div>
    </header>
    {ShowNotification && (
      <DropdownNotification onClose={() => setShowNotification(false)} />
    )}
   </>
  );
};

export default Header;