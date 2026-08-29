import { FaBell } from 'react-icons/fa';
import DropdownNotification from './DropdownNotification';
import { IoMdMenu } from "react-icons/io";
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { NotificationService } from '../../services/NotificationService';
import { toast } from 'react-toastify';

const Header = ({ sidebarOpen, setSidebarOpen, pageTitle }) => {
  const [ShowNotification, setShowNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      try {
        const res = await NotificationService.getUnreadCount();
        if (res.status) {
          setUnreadCount(res.unread_count);
        }
      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };
    fetchUnreadCount();

    // Setup Socket.IO connection
    // Ensure BASE_URL doesn't end with api path for socket connection if it does
    let socketUrl = process.env.REACT_APP_BASE_URL || '';
    if (socketUrl.includes('/api/v1/')) {
      socketUrl = socketUrl.replace(/\/api\/v1\/?$/, '');
    } else if (socketUrl.includes('/api/')) {
      socketUrl = socketUrl.replace(/\/api\/?$/, '');
    }

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
      const currentUserId = localStorage.getItem("craftdelhiadmin_id") || "admin"; // Use proper admin identifier
      if (currentUserId) {
        socket.emit('join', currentUserId);
      }
    });

    socket.on('notification', (data) => {
      console.log('⚡ Instant Notification Received:', data);
      toast.info(`${data.title}: ${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

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
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
        </div>
      </div>
    </header>
    {ShowNotification && (
      <DropdownNotification 
        onClose={() => setShowNotification(false)}
        setUnreadCount={setUnreadCount}
      />
    )}
   </>
  );
};

export default Header;