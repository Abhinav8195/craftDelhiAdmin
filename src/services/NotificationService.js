import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Set up default headers with token
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
});

export const NotificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${BASE_URL}notifications?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}notifications/unread-count`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axios.put(`${BASE_URL}notifications/${id}/read`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await axios.put(`${BASE_URL}notifications/read-all`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}notifications/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};
