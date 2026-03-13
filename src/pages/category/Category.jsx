import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Plus, Edit2, Trash2, ChevronRight,
  FolderTree, Layers, Loader2, Info
} from 'lucide-react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../../services/categoryService';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Category = () => {
  // Main state
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Loading states
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  
  // Form states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [catForm, setCatForm] = useState({ name: '' });
  const [subCatForm, setSubCatForm] = useState({ name: '' });

  // ---------------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------------
  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const { data } = await getAllCategories();
      if (data.status) {
        setCategories(data.data);
        console.log("ok testing",data.data);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      toast.error("Error fetching categories");
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    setLoadingSubs(true);
    try {
      const { data } = await getSubcategoriesByCategory(categoryId);
      if (data.status) {
        setSubcategories(data.data || []);
        console.log("ok abc",data.data);
      } else {
        setSubcategories([]);
        toast.error(data.message || "Failed to fetch subcategories");
      }
    } catch (err) {
      setSubcategories([]);
      // Only show error if it's not a generic 404 meaning "no subcategories found"
      if (err.response?.status !== 404) {
        toast.error("Error fetching subcategories");
      }
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory.id);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  // ---------------------------------------------------------------------------------
  // Category Actions
  // ---------------------------------------------------------------------------------
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return toast.error("Category name is required");
    setActionLoading(true);

    try {
      if (editingCategory) {
        const { data } = await updateCategory(editingCategory.id, { name: catForm.name });
        if (data.status) {
          toast.success(data.message);
          fetchCategories();
          closeCatModal();
        } else {
          toast.error(data.message);
        }
      } else {
        // Create expects 'categoryName', not 'name'
        const { data } = await createCategory({ categoryName: catForm.name });
        // The API returns message successfully without data.status, so check for success text or category object
        if (data.category || data.message?.includes('success')) {
          toast.success("Category created successfully");
          fetchCategories();
          closeCatModal();
        } else {
          toast.error(data.message || "Failed to create category");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const { data } = await deleteCategory(id);
      if (data.status) {
        toast.success(data.message);
        if (selectedCategory?.id === id) setSelectedCategory(null);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting category");
    }
  };

  const closeCatModal = () => {
    setIsCatModalOpen(false);
    setEditingCategory(null);
    setCatForm({ name: '' });
  };

  // ---------------------------------------------------------------------------------
  // Subcategory Actions
  // ---------------------------------------------------------------------------------
  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    if (!subCatForm.name.trim()) return toast.error("Subcategory name is required");
    if (!selectedCategory) return toast.error("Select a parent category first");
    setActionLoading(true);

    try {
      if (editingSubcategory) {
        const { data } = await updateSubcategory(editingSubcategory.id, { name: subCatForm.name });
        if (data.status) {
          toast.success(data.message);
          fetchSubcategories(selectedCategory.id);
          closeSubCatModal();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await createSubcategory({ name: subCatForm.name, parent_id: selectedCategory.id });
        if (data.status) {
          toast.success(data.message);
          fetchSubcategories(selectedCategory.id);
          closeSubCatModal();
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving subcategory");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      const { data } = await deleteSubcategory(id);
      if (data.status) {
        toast.success(data.message);
        fetchSubcategories(selectedCategory.id);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting subcategory");
    }
  };

  const closeSubCatModal = () => {
    setIsSubCatModalOpen(false);
    setEditingSubcategory(null);
    setSubCatForm({ name: '' });
  };

  // ---------------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------------
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="h-full bg-gray-50/50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Catalog Management</h1>
        <p className="text-gray-500 mt-2">Organize your products into categories and subcategories.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] min-h-[600px]">
        
        {/* ========================================================= */}
        {/* LEFT PANE: Categories */}
        {/* ========================================================= */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <FolderTree className="w-5 h-5 text-blue-600" />
              Categories
            </div>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              title="Add Category"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loadingCats ? (
              <LoadingSpinner />
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No categories found.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                      selectedCategory?.id === cat.id
                        ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                        : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium truncate max-w-[200px]">{cat.name}</div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(cat);
                          setCatForm({ name: cat.name });
                          setIsCatModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCategory(cat.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className={`w-4 h-4 ml-1 ${selectedCategory?.id === cat.id ? 'text-blue-600' : 'text-gray-300'}`} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: Subcategories */}
        {/* ========================================================= */}
        <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          {!selectedCategory ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Layers className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Select a Category</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Choose a category from the left pane to view and manage its subcategories.</p>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    Categories <ChevronRight className="w-3 h-3" /> <span className="text-blue-600 font-medium">{selectedCategory.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    Subcategories
                  </div>
                </div>
                <button
                  onClick={() => setIsSubCatModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subcat</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
                {loadingSubs ? (
                  <LoadingSpinner />
                ) : subcategories.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                    <Info className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>No subcategories found for <span className="font-semibold">{selectedCategory.name}</span>.</p>
                    <button 
                      onClick={() => setIsSubCatModalOpen(true)}
                      className="mt-4 text-indigo-600 font-medium hover:underline"
                    >
                      Create the first one
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcategories.map((sub) => (
                      <div key={sub.id} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 line-clamp-1" title={sub.name}>{sub.name}</h4>
                          <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">Sub</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">ID: #{sub.id}</p>
                        
                        <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                          <button
                            onClick={() => {
                              setEditingSubcategory(sub);
                              setSubCatForm({ name: sub.name });
                              setIsSubCatModalOpen(true);
                            }}
                            className="flex-1 py-1.5 text-xs font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <div className="w-px h-4 bg-gray-200"></div>
                          <button
                            onClick={(e) => handleDeleteSubcategory(sub.id, e)}
                            className="flex-1 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Category Modal */}
      {/* ========================================================= */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={closeCatModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              autoFocus
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Laptops"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={closeCatModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* Subcategory Modal */}
      {/* ========================================================= */}
      <Modal
        isOpen={isSubCatModalOpen}
        onClose={closeSubCatModal}
        title={editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
      >
        <form onSubmit={handleSaveSubcategory} className="space-y-5">
          {!editingSubcategory && selectedCategory && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
              <div>
                Adding to parent category: <span className="font-bold">{selectedCategory.name}</span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
            <input
              type="text"
              autoFocus
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Gaming Laptops"
              value={subCatForm.name}
              onChange={(e) => setSubCatForm({ ...subCatForm, name: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={closeSubCatModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingSubcategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Category;