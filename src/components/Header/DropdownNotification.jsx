import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const notifications = [
  {
    id: 1,
    title: 'New Message Received',
    message: 'You have a new message from John Doe.',
    icon: <FaBell className="text-blue-500" />,
    date: '11 Apr, 2025',
  },
  {
    id: 2,
    title: 'Order Confirmed',
    message: 'Your order #1234 has been successfully confirmed.',
    icon: <FaCheckCircle className="text-green-500" />,
    date: '10 Apr, 2025',
  },
  {
    id: 3,
    title: 'Server Downtime Alert',
    message: 'Scheduled maintenance on 14th Apr from 2AM to 5AM.',
    icon: <FaExclamationTriangle className="text-yellow-500" />,
    date: '09 Apr, 2025',
  },
  {
    id: 4,
    title: 'New Feature Released',
    message: 'Explore the new dark mode and advanced filters now!',
    icon: <FaInfoCircle className="text-indigo-500" />,
    date: '08 Apr, 2025',
  },
];

const DropdownNotification = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 z-[998]"
      />

      {/* Slide-in Panel */}
      <div className="fixed top-0 right-0 z-[999] h-full w-[340px] sm:w-[400px] bg-white dark:bg-boxdark shadow-lg transition-transform duration-300 animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke dark:border-strokedark">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Notifications
          </h2>
          <button onClick={onClose}>
            <IoClose className="text-xl text-gray-700 dark:text-white hover:text-red-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-full px-4 py-3 space-y-5">
          {notifications.length === 0 ? (
            <div className="text-center mt-10 text-gray-500 dark:text-gray-300 text-sm">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="flex items-start gap-3 border-t pt-4 border-stroke dark:border-strokedark">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-white font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownNotification;