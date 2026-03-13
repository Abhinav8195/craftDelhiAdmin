import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateStatus,
} from "../../services/giftCategoryService";
import { toast } from "react-toastify";
import {
  Plus, Trash2, Edit2, Search, Image as ImageIcon, CheckCircle2, XCircle, Gift, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {title.includes('Edit') ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
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

const GiftCategory = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    gift_image: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      // Ensure we always have an array even on failures to map gracefully
      setCategories(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch gift categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    if (form.gift_image) formData.append("gift_image", form.gift_image);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Gift Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Gift Category created successfully");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving gift category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      title: cat.title,
      slug: cat.slug,
      description: cat.description || "",
      gift_image: null,
    });
    setImagePreview(cat.gift_image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (id, status, e) => {
    e.stopPropagation();
    try {
      await updateStatus(id, status ? 0 : 1);
      fetchCategories();
    } catch {
      toast.error("Status update failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImagePreview(null);
    setForm({
      title: "",
      slug: "",
      description: "",
      gift_image: null,
    });
  };

  const filteredData = categories.filter((cat) =>
    cat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-gray-50/50 p-4 md:p-6 lg:p-8 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Gift className="w-8 h-8 text-indigo-600" />
            Gift Categories
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Manage the gift classification catalog and settings.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* MODAL FORM SECTION */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingId ? "Edit Gift Category" : "Add New Gift Category"}
      >
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              placeholder="e.g. Birthday Gifts"
              required
              value={form.title}
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  title: value,
                  slug: value.toLowerCase().replace(/\s+/g, "-"),
                });
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
            <input
              type="text"
              placeholder="e.g. birthday-gifts"
              required
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
             <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Brief description about the category"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="md:col-span-2">
             <label className="text-sm font-medium text-gray-700 block mb-2">Category Image</label>
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-44 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors relative overflow-hidden group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon className="text-indigo-500 w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-indigo-600">Click to upload image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
              </div>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  setForm({ ...form, gift_image: e.target.files[0] });
                  if (e.target.files[0]) {
                    setImagePreview(
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
              />
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={closeModal}
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
              {editingId ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* GRID DISPLAY SECTION */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading gift categories...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Gift Categories Found</h3>
            <p className="text-gray-500 mb-6">{search ? "Try adjusting your search query." : "You haven't added any gift categories yet."}</p>
            {!search && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add First Category
              </button>
            )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredData.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-50 border-b border-gray-100 overflow-hidden flex items-center justify-center">
                  {cat.gift_image ? (
                     <img
                       src={cat.gift_image}
                       alt={cat.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  )}
                  
                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleStatusChange(cat.id, cat.status, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm backdrop-blur-md transition-transform hover:scale-105 ${
                        cat.status === 1
                          ? "bg-emerald-500/90 text-white"
                          : "bg-gray-800/80 text-white"
                      }`}
                      title="Click to toggle status"
                    >
                      {cat.status === 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {cat.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-1" title={cat.title}>
                    {cat.title}
                  </h3>
                  <p className="text-xs font-medium text-indigo-500 bg-indigo-50 self-start px-2 py-0.5 rounded-md mb-3">
                    /{cat.slug}
                  </p>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mt-auto">
                    {cat.description || "No description provided."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t border-gray-50 bg-gray-50/50 flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(cat.id, e)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCategory;
