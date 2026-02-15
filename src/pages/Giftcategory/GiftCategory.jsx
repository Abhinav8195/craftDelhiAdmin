import { useEffect, useState, useRef } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateStatus,
} from "../../services/giftCategoryService";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiImage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const GiftCategory = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const formRef = useRef(null);

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
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    if (form.gift_image) formData.append("gift_image", form.gift_image);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Created successfully");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (cat) => {
    setSearch("");
    setEditingId(cat.id);
    setForm({
      title: cat.title,
      slug: cat.slug,
      description: cat.description || "",
      gift_image: null,
    });
    setImagePreview(cat.gift_image);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Deleted successfully");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status ? 0 : 1);
      fetchCategories();
    } catch {
      toast.error("Status update failed");
    }
  };

  const resetForm = () => {
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
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Gift Categories
        </h1>

        <div className="flex items-center gap-2 w-72 border border-gray-200 bg-white rounded-lg px-3 py-2  ">
          <FiSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm border-none focus:ring-0"
          />
        </div>
      </div>

      <AnimatePresence>
        {search.length === 0 && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FiPlus />
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Title"
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
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Slug"
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 md:col-span-2"
                />

                <div className="md:col-span-2">
                  <label className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-36 bg-gray-50 hover:bg-indigo-50 transition">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="max-h-32 max-w-full object-contain rounded-lg"
                        />
                      ) : (
                        <>
                          <FiImage className="text-gray-400 text-3xl mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload image
                          </span>
                        </>
                      )}
                    </div>

                    <input
                      type="file"
                      className="hidden"
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

                <div className="md:col-span-2 flex gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
                    {editingId ? "Update" : "Create"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-200 px-6 py-3 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
          >
            {cat.gift_image && (
              <div className="relative">
                <img
                  src={cat.gift_image}
                  alt=""
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <span
                  onClick={() =>
                    handleStatusChange(cat.id, cat.status)
                  }
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full cursor-pointer ${
                    cat.status === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {cat.status === 1 ? "Active" : "Inactive"}
                </span>
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-gray-800">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {cat.slug}
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 bg-indigo-50 rounded-md text-indigo-600"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 bg-red-50 rounded-md text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GiftCategory;
