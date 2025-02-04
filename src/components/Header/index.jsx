import DropdownNotification from './DropdownNotification';
import { IoMdMenu } from "react-icons/io";

const Header = ({ sidebarOpen, setSidebarOpen,pageTitle }) => {
  return (
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
        <div className="w-[1233px] h-[90px] px-6 py-[16px]  justify-end items-center gap-4 inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
            <div className="text-[#36234e] text-base font-bold font-['Montserrat'] leading-normal">
              {pageTitle}
            </div>
          </div>
          <div className="grow shrink basis-0 h-2"></div>
          
          {/* Notification (Always visible) */}
          <div className="p-10 bg-white justify-end items-center gap-2 flex">
          <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification Menu Area */}
            <DropdownNotification />
          </ul>
        </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
