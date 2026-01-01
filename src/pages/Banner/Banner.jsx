import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [form, setForm] = useState({
    title: "",
    type: "image",
    status: 1,
    banner: null,
  });

  const token = localStorage.getItem("craftdelhiadmin_token");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}admin/getbanner`
      );
      if (res.data?.success) setBanners(res.data.data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddForm = () => {
    setForm({ title: "", type: "image", status: 1, banner: null });
    setEditingBanner(null);
    setOpenForm(true);
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner.id);
    setForm({
      title: banner.title,
      type: banner.type,
      status: banner.status,
      banner: null,
    });
    setOpenForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("type", form.type);
    fd.append("status", form.status);
    if (form.banner) fd.append("banner", form.banner);

    try {
      if (editingBanner) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}admin/update-banner/${editingBanner}`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Banner updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}admin/add-banner`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Banner created successfully");
      }

      setOpenForm(false);
      fetchBanners();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error saving banner"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}admin/delete-banner/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-[#024a63]">
          Banner Management
        </h1>

        <button
          className="w-full sm:w-auto px-4 py-2 bg-[#024a63] text-white rounded-lg shadow hover:opacity-90"
          onClick={openAddForm}
        >
          + Add New Banner
        </button>
      </div>

      {/* desktop/tablet view */}
      <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
        {loading && <p className="text-center py-4">Loading banners...</p>}

        {!loading && (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Preview</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.map((b, i) => (
                <tr key={b.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="p-3">{b.id}</td>

                  <td className="p-3">
                    {b.type === "video" ? (
                      <video src={b.banner} className="w-28 h-16 rounded-lg shadow" />
                    ) : (
                      <img
                        src={b.banner}
                        className="w-28 h-16 rounded-lg shadow hover:scale-105 transition"
                        alt=""
                      />
                    )}
                  </td>

                  <td className="p-3">{b.title}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      b.type === "video" ? "bg-purple-500" : "bg-green-500"
                    }`}>
                      {b.type}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      b.status === 1 ? "bg-emerald-600" : "bg-gray-400"
                    }`}>
                      {b.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 text-center space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                      onClick={() => openEditForm(b)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="space-y-3 md:hidden">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-xl shadow p-3">

            {b.type === "video" ? (
              <video src={b.banner} className="w-full h-40 rounded-lg" />
            ) : (
              <img src={b.banner} className="w-full h-40 rounded-lg object-cover" alt="" />
            )}

            <div className="mt-2">
              <div className="font-semibold">{b.title}</div>

              <div className="text-xs text-gray-500">ID: {b.id}</div>

              <div className="flex justify-between mt-2">
                <span className={`px-2 py-1 rounded text-white text-xs ${
                  b.type === "video" ? "bg-purple-500" : "bg-green-500"
                }`}>
                  {b.type}
                </span>

                <span className={`px-2 py-1 rounded text-white text-xs ${
                  b.status === 1 ? "bg-emerald-600" : "bg-gray-400"
                }`}>
                  {b.status === 1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  className="w-1/2 py-1 bg-blue-500 rounded text-white"
                  onClick={() => openEditForm(b)}
                >
                  Edit
                </button>

                <button
                  className="w-1/2 py-1 bg-red-500 rounded text-white"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {openForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[430px] shadow-xl">

            <h2 className="text-lg font-bold mb-4 text-[#024a63]">
              {editingBanner ? "Update Banner" : "Create Banner"}
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="space-y-3">

              <input
                type="text"
                placeholder="Banner Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <select
                className="w-full border p-2 rounded"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>

              <select
                className="w-full border p-2 rounded"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: Number(e.target.value) })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>

              <input
                type="file"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, banner: e.target.files[0] })
                }
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-1 bg-[#024a63] text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
