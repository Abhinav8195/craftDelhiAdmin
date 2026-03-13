import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, Image as ImageIcon, Video, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// Helper Modal Component matching the SaaS theme
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {title.includes('Update') ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      if (res.data?.success) setBanners(res.data.data || []);
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
      banner: null, // we don't preview the existing one here yet, but we could add it
    });
    setOpenForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);

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
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

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

  // ----------------------------------------------------------------------
  // Badges & Render Helpers
  // ----------------------------------------------------------------------
  const TypeBadge = ({ type }) => {
    if (type === 'video') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Video className="w-3.5 h-3.5" /> Video
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <ImageIcon className="w-3.5 h-3.5" /> Image
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
        <XCircle className="w-3.5 h-3.5" /> Inactive
      </span>
    );
  };

  return (
    <div className="h-full bg-gray-50/50 p-4 md:p-6 lg:p-8 min-h-screen">
      
      {/* ---------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-indigo-600" />
            Banner Management
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Upload and manage rotating hero banners or promos.</p>
        </div>

        <button
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-md"
          onClick={openAddForm}
        >
          <Plus className="w-5 h-5" />
          <span>Add Banner</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
           <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
           <p className="text-gray-500 font-medium">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Banners Found</h3>
            <p className="text-gray-500 mb-6">You haven't uploaded any banners yet. Start by adding one!</p>
            <button 
              onClick={openAddForm}
              className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add First Banner
            </button>
        </div>
      ) : (
        <>
          {/* ---------------------------------------------------------------- */}
          {/* DESKTOP TABLE VIEW */}
          {/* ---------------------------------------------------------------- */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-2xl">ID</th>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {banners.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-medium">#{b.id}</td>
                      <td className="px-6 py-4">
                        <div className="w-32 h-16 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                          {b.type === "video" ? (
                            <video src={b.banner} className="w-full h-full object-cover" muted loop autoPlay />
                          ) : (
                            <img src={b.banner} className="w-full h-full object-cover" alt={b.title} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{b.title}</td>
                      <td className="px-6 py-4">
                         <TypeBadge type={b.type} />
                      </td>
                      <td className="px-6 py-4">
                         <StatusBadge status={b.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            onClick={() => openEditForm(b)}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDelete(b.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MOBILE CARD VIEW */}
          {/* ---------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                  {b.type === "video" ? (
                    <video src={b.banner} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={b.banner} className="w-full h-full object-cover" alt={b.title} />
                  )}
                  {/* Status overlay */}
                  <div className="absolute top-3 right-3 shadow-sm rounded-md overflow-hidden opacity-90">
                    <StatusBadge status={b.status} />
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{b.title}</h3>
                    <TypeBadge type={b.type} />
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-4">ID: #{b.id}</div>

                  <div className="flex gap-2 mt-auto border-t border-gray-50 pt-3">
                    <button
                      className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-xl text-sm font-medium transition-colors"
                      onClick={() => openEditForm(b)}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl text-sm font-medium transition-colors"
                      onClick={() => handleDelete(b.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* FORM MODAL */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        title={editingBanner ? "Update Banner" : "Create New Banner"}
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Banner Title</label>
            <input
              type="text"
              placeholder="e.g. Summer Sale 2026"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Media Type</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
             </div>
             
             <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: Number(e.target.value) })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm font-medium text-gray-700">Media File</label>
             <div className="relative">
                <input
                  type="file"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-200 rounded-xl bg-gray-50 transition-all cursor-pointer"
                  onChange={(e) =>
                    setForm({ ...form, banner: e.target.files[0] })
                  }
                />
             </div>
             <p className="text-xs text-gray-500 mt-2">Optimal size: 1920x1080px. Max size: 10MB.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingBanner ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Banner;
