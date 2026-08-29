import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaTrash, FaCheckDouble, FaInfoCircle } from 'react-icons/fa';
import { NotificationService } from '../../services/NotificationService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DropdownNotification = ({ onClose, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotificationService.getNotifications(1, 20);
      if (res.status && res.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
      case 'ORDER_PLACED':
        return <FaBell className="text-blue-500" />;
      case 'PRODUCT_APPROVED':
      case 'PAYMENT_RECEIVED':
        return <FaCheckCircle className="text-green-500" />;
      case 'PRODUCT_REJECTED':
      case 'ORDER_CANCELLED':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'ORDER_STATUS':
        return <FaInfoCircle className="text-indigo-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const handleNotificationClick = async (notif) => {
    // Mark as read if unread
    if (!notif.is_read) {
      try {
        await NotificationService.markAsRead(notif.id);
        setNotifications((prev) => 
          prev.map((n) => n.id === notif.id ? { ...n, is_read: 1 } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking as read", error);
      }
    }

    // Navigate (Admin routes)
    switch (notif.type) {
      case 'PRODUCT_APPROVED':
      case 'PRODUCT_REJECTED':
        navigate(`/product`);
        break;
      case 'NEW_ORDER':
      case 'ORDER_STATUS':
      case 'ORDER_CANCELLED':
      case 'PAYMENT_RECEIVED':
        navigate(`/order-management`); 
        break;
      default:
        break;
    }
    onClose();
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent trigger click on notification
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) => {
        const notif = prev.find(n => n.id === id);
        if (notif && !notif.is_read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== id);
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-40 z-[998]" />
      <div
        className={`fixed top-0 right-0 z-[999] h-full w-[340px] sm:w-[400px] bg-white dark:bg-boxdark shadow-lg transform transition-transform duration-300 ${
          mounted ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke dark:border-strokedark">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h2>
          <div className="flex items-center gap-3">
            <button onClick={handleMarkAllRead} title="Mark all as read" className="text-gray-500 hover:text-blue-500">
              <FaCheckDouble size={18} />
            </button>
            <button onClick={onClose}>
              <IoClose className="text-xl text-gray-700 dark:text-white hover:text-red-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow px-4 py-3 space-y-2">
          {loading ? (
            <div className="text-center mt-10 text-gray-500 dark:text-gray-300 text-sm">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center mt-10 text-gray-500 dark:text-gray-300 text-sm">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleNotificationClick(item)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${!item.is_read ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <div className="mt-1">{getIcon(item.type)}</div>
                <div className="flex-grow">
                  <p className={`text-sm text-gray-800 dark:text-white ${!item.is_read ? 'font-bold' : 'font-medium'}`}>{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete notification"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownNotification;
