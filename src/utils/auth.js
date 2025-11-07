export const getAdminToken = () => {
  return localStorage.getItem("craftdelhiadmin_token") || "";
};