import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Set up default headers with token
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
});

// ==========================================
// Category APIs
// ==========================================

// Create Category
export const createCategory = (data) =>
  axios.post(`${BASE_URL}categories/create`, data, {
    headers: getHeaders(),
  });

// Get All Categories
export const getAllCategories = () =>
  axios.get(`${BASE_URL}categories/get`, {
    headers: getHeaders(),
  });

// Update Category
export const updateCategory = (id, data) =>
  axios.put(`${BASE_URL}categories/update/${id}`, data, {
    headers: getHeaders(),
  });

// Delete Category
export const deleteCategory = (id) =>
  axios.delete(`${BASE_URL}categories/delete/${id}`, {
    headers: getHeaders(),
  });

// ==========================================
// Subcategory APIs
// ==========================================

// Create Subcategory
export const createSubcategory = (data) =>
  axios.post(`${BASE_URL}categories/create-subcategory`, data, {
    headers: getHeaders(),
  });

// Get Subcategories by Category ID
export const getSubcategoriesByCategory = (categoryId) =>
  axios.get(`${BASE_URL}categories/subcategories/${categoryId}`, {
    headers: getHeaders(),
  });

// Update Subcategory
export const updateSubcategory = (id, data) =>
  axios.put(`${BASE_URL}categories/update-subcategory/${id}`, data, {
    headers: getHeaders(),
  });

// Delete Subcategory
export const deleteSubcategory = (id) =>
  axios.delete(`${BASE_URL}categories/delete-subcategory/${id}`, {
    headers: getHeaders(),
  });
