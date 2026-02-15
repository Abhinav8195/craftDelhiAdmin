import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Get All Categories
export const getAllCategories = () =>
  axios.get(`${BASE_URL}/gift-categories/get`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
    },
  });

// Create Category
export const createCategory = (formData) =>
  axios.post(`${BASE_URL}/gift-categories/add`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

// Update Category
export const updateCategory = (id, formData) =>
  axios.put(`${BASE_URL}/gift-categories/edit/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Category
export const deleteCategory = (id) =>
  axios.delete(`${BASE_URL}/gift-categories/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
    },
  });

// Update Status
export const updateStatus = (id, status) =>
  axios.put(
    `${BASE_URL}/gift-categories/editstatus/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
      },
    }
  );
