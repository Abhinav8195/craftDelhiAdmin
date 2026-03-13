import React, { useEffect, useState } from 'react';
import image from '../../assets/images/image.png'
import { getAdminToken } from '../../utils/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
const EditProduct = ({card1,product}) => {

  console.log(product)

  console.log('product',product)
  const token = getAdminToken()
  const seller_id = 1;

  const [packageWeight, setPackageWeight] = useState("2");
    const [productName, setProductName] = useState("");
    const [file, setFile] = useState(null);
    const [unit, setUnit] = useState("kg");
    const [warranty, setWarranty] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [reelName, setReelName] = useState("");
    const [reelFile, setReelFile] = useState(null);
    const [videoName, setVideoName] = useState("");
    const [description, setDescription] = useState("");
    const [fileName, setFileName] = useState("No file chosen");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [images, setImages] = useState([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null }
  ]);



  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}categories/get`,
        { headers: { Authorization: `${token}` } }
      );
      if (res.data.status) setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category_id || "");
      setQuantity(product.stock || "");
      // Parse hashtags from product.hashtags if available
      let parsedHashtags = [];
      if (product.hashtags) {
        try {
          const parsed = JSON.parse(product.hashtags);
          if (Array.isArray(parsed)) {
            parsedHashtags = parsed.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
          }
        } catch (e) {
          console.error('Error parsing hashtags:', e);
        }
      } else if (product.slug) {
        parsedHashtags = product.slug.split(" ");
      }
      setHashtags(parsedHashtags);

      // Gallery mapping
      if (product.gallery_images) {
        const gallery = product.gallery_images.map(img => ({
          file: null,
          preview: img
        }));
        while (gallery.length < 4) gallery.push({ file: null, preview: null });
        setImages(gallery);
      }
    }
  }, [product]);

const handleAddCategory = async () => {
  if (!newCategory.trim()) return toast.error("Enter category name");

  try {
    const body = { categoryName: newCategory, sellerId: seller_id };

    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}categories/create`,
      body,
      { headers: { Authorization: `${token}` } }
    );

    toast.success(res.data.message);
    setNewCategory("");
    setShowCategoryModal(false);
    fetchCategories();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create category");
  }
};

const formatHashtags = (value) => {
  return value
    .trim()
    .split(" ")
    .filter(word => word.trim() !== "")
    .map(word => (word.startsWith("#") ? word : `#${word}`))
    .join(" ");
};

const addHashtag = () => {
  const clean = hashtagInput.trim().replace(/#/g, "");
  if (!clean) return;
  if (hashtags.includes(`#${clean}`)) return toast.error("Hashtag already added");

  setHashtags([...hashtags, `#${clean}`]);
  setHashtagInput("");
};
const removeHashtag = (tag) => {
  setHashtags(hashtags.filter(h => h !== tag));
};

// const [editingId, setEditingId] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleReelFileChange = (event) => {
    const file = event.target.files[0];
    setReelFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  const handleProductFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      toast.error("Only image files are allowed here.");
    }
  };

  const handleImageChange = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    const newImages = [...images];
    newImages[index] = {
      file,
      preview: URL.createObjectURL(file)
    };
    setImages(newImages);
  }
};



  const handleSubmit = async () => {
  if (!product) return toast.error("No product found!");

  if (!productName.trim()) return toast.error("Product Name required");
  if (!price) return toast.error("Price required");
  if (!category) return toast.error("Category required");

  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("category_id", category);
  formData.append("stock", quantity);
  formData.append("dimension", dimensions);
  formData.append("package_weight", packageWeight);
  formData.append("weight_type", unit);
  formData.append("warranty_type", warranty);

  // Hashtags format
  if (hashtags.length > 0) {
    formData.append("hashtags", JSON.stringify(hashtags.map(tag => tag.replace('#', ''))));
  }

  // Main Image
  if (file) {
    formData.append("main_image", file);
  } else if (product?.main_image_url) {
    formData.append("main_image_url", product.main_image_url);
  }

  // Product Video
  if (selectedFile instanceof File) {
    formData.append("product_video", selectedFile);
  } else if (product?.video_url) {
    formData.append("video_url", product.video_url);
  }

  // Reel Video
  if (reelFile instanceof File) {
    formData.append("product_reel", reelFile);
  } else if (product?.reel_url) {
    formData.append("reel_url", product.reel_url);
  }

  // Gallery Images
  const newlyUploaded = images.filter(i => i.file);
  if (newlyUploaded.length > 0) {
    newlyUploaded.forEach(img => formData.append("gallery_images", img.file));
  } else if (product?.gallery_images?.length) {
    formData.append("gallery_images", JSON.stringify(product.gallery_images));
  }

  try {
    const config = {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}admin/updateproductbyadmin/${product.id}`,
      formData,
      config
    );

    if (response.data.status) {
      toast.success("Product updated successfully!");
      card1(null); 
    } else {
      toast.error(response.data.message || "Something went wrong");
    }

  } catch (err) {
    console.log(err);
    toast.error("Error updating product");
  } finally {
    setIsSubmitting(false);
  }
};




  
useEffect(() => {
  if (!product) return;

  setProductName(product.name || "");
  setPrice(product.price || "");
  setDescription(product.description || "");
  setCategory(product.category_id || "");
  setQuantity(product.stock || "");
  setPackageWeight(product.package_weight || "");
  setUnit(product.weight_type || "gram");
  setWarranty(product.warranty_type || "");
  setVideoName(product.video_name || "");
  setReelName(product.reel_name || "");
  // Parse hashtags from product.hashtags if available
  let parsedHashtags = [];
  if (product.hashtags) {
    try {
      let parsed = JSON.parse(product.hashtags);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (Array.isArray(parsed)) {
        parsedHashtags = parsed.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
      }
    } catch (e) {
      console.error('Error parsing hashtags:', e);
    }
  } else if (product.slug) {
    parsedHashtags = product.slug.split(" ");
  }
  setHashtags(parsedHashtags);

  // gallery
  if (product.gallery_images) {
    const mapped = product.gallery_images.slice(0,4).map(img => ({
      file: null,
      preview: img
    }));
    while (mapped.length < 4) mapped.push({ file: null, preview: null });
    setImages(mapped);
  }

}, [product]);

  
  return (
     <div className="flex justify-center items-center min-h-screen bg-white ">
            <div className="w-full max-w-[9xl] bg-white rounded-xl shadow-lg p-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                    <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">{'Product Information :'} </div>
                </div>
                <div className="border-2 border-[#d9d9d9]"></div>
                </div>
    
                {/* Product Details Section */}
                <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-2">
            <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase tracking-widest">
                Product Name
                </label>
                <input
                type="text"
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-sm font-medium font-['Montserrat'] leading-tight"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                />
            </div>
    
            <div className="flex flex-col gap-2">
      <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase tracking-widest">
        Hashtags / Tags
      </label>
    
      {/* Tag Display */}
      <div className="flex flex-wrap gap-2 p-2 border border-[#e0e4f4] rounded bg-white min-h-[48px]">
        {hashtags.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-[#024a63]/10 text-[#024a63] px-2 py-1 text-xs rounded-full"
          >
            {tag}
            <button
              className="text-red-500 text-sm"
              onClick={() => removeHashtag(tag)}
            >
              ×
            </button>
          </span>
        ))}
    
        <input
  type="text"
  value={hashtagInput}
  onChange={(e) => setHashtagInput(e.target.value)}
  onKeyDown={(e) => (e.key === " " ? addHashtag() : null)}
  className="flex-grow min-w-[120px] border-none bg-transparent text-xs focus:outline-none focus:ring-0 focus:border-none"
  placeholder="Type and press space"
/>

      </div>
    </div>
    
    
    
            
            {/* IMAGE Upload Section */}
    <div className="bg-white border border-[#e0e4f4] rounded-lg p-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {file ? (
          <img
            className="w-[100px] h-[118px] border border-[#ecf0ff] rounded object-cover"
            src={URL.createObjectURL(file)}
            alt="Preview"
          />
        ) : (
          <img
            className="w-[100px] h-[118px] border border-[#ecf0ff] rounded object-cover"
            src={product?.main_image_url || image}
            alt="Preview"
          />
        )}
    
        <div className="flex flex-col gap-2.5 flex-grow">
          <p className="text-black text-sm font-medium font-['Montserrat'] leading-tight">
            Min size: 480x480 px. Max file size: 10MB. Supported format: JPG, PNG
          </p>
    
          <div className="flex items-center gap-3 p-2.5 bg-[#ebefff] rounded-lg">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleProductFileChange}
            />
    
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="p-3 bg-[#024a63] rounded text-white text-sm font-medium font-['Montserrat']">
                Choose File
              </div>
            </label>
    
            <span className="text-[#3b3b3b] text-base font-bold font-['Montserrat']">
              {file ? file.name : "No file chosen"}
            </span>
          </div>
        </div>
      </div>
    </div>
    
            </div>
    
    
                {/* Additional Images Section */}
                <div className="flex flex-col gap-3 w-full">
            <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">
                Additional Images
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {images.map((imagee, index) => (
                <div
                    key={index}
                    className="h-[158px] p-5 bg-white rounded-[5px] border border-[#e0e4f4] flex flex-col justify-start items-start gap-5"
                >
                    <div className="flex justify-start items-center gap-5 w-full">
                    <img
                        className="w-[100px] h-[118px] border border-[#ecf0ff] object-cover"
                        src={imagee.preview || image}
                        alt={`Preview ${index + 1}`}
                    />
                    <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                        <div className="p-2.5 bg-[#ebefff] rounded-[5px] flex justify-start items-center gap-[30px] w-full">
                        <label className="p-4 bg-[#024a63] text-white text-sm font-medium rounded flex justify-center items-center cursor-pointer">
                            Choose File
                            <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                            />
                        </label>
                        <div className="text-[#3b3b3b] text-xs font-bold font-['Montserrat'] leading-normal">
                            {imagee ? "Image Selected" : "Choose File"}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
    
    
        <div className="space-y-4">
            <h2 className="text-black text-2xl font-bold">Product Details</h2>
            <div className="border-2 border-[#d9d9d9]"></div>
    
            {/* Description */}
            <div className="space-y-2">
                <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Description</h3>
                <div className="p-3 bg-white rounded border border-[#d9d9d9]">
                <textarea
                    className="w-full h-28 p-2 text-black text-xs border-none focus:outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={300}
                    placeholder='I would like this order delivered on my friend’s anniversary. Could you ensure it arrives on the 25th in the morning? It’s a delicate item, so please handle it with extra care. Also, please include a small note that says, ‘Happy Anniversary, wishing you both endless love and joy!’ It would mean a lot if it’s packaged beautifully. Thank you for your attention to detail!'
                />
                <div className="text-right text-black text-[10px] font-bold uppercase tracking-widest">
                    {description.length}/300
                </div>
                </div>
            </div>
    
            {/* Price & Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">PRICE (Rs)</h3>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
                    placeholder='2000'
                />
                </div>
            
                <div className="space-y-2">
      <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">
        Category
      </h3>
    
      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
    
        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-3 bg-[#024a63] text-white rounded"
        >
          +
        </button>
      </div>
    </div>
    
            </div>
    
            {showCategoryModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg w-80 space-y-3 shadow-lg">
          <h3 className="text-lg font-bold mb-2">Add New Category</h3>
    
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
    
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="px-4 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-1 bg-[#024a63] text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}
    
            {/* Quantity & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Quantity in Stock</h3>
                <input
                    type="number"
                    value={quantity || product?.stock}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
                />
                </div>
                <div className="space-y-2">
                <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">
                    Product Dimension <span className="text-[#ee6f69]">(Length, Width, Height)</span> Optional
                </h3>
                <input
                    type="text"
                    value={dimensions || product?.dimension}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
                    placeholder='20 x 15 x 10 cm'
                />
                </div>
            </div>
            </div>
                </div>
    
                {/* Video Upload Section */}
                <div className="  space-y-4">
            {/* Title */}
            <h2 className="text-black text-2xl font-bold">Video Upload</h2>
            <div className="border-2 border-[#d9d9d9]"></div>
    
            {/* Reel Name */}
            <div className="space-y-3">
                <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Reel Name</h3>
                <input
                type="text"
               value={videoName !== "" ? videoName : product?.video_name || ""}
                onChange={(e) => setVideoName(e.target.value)}
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
                placeholder="The Ultimate Celebration Box"
                />
            </div>
    
            
            <div className="p-5 bg-white rounded border border-[#e0e4f4] space-y-5">
                <div className="flex flex-wrap items-center gap-5">
                {selectedFile ? (
  <video
    width="100"
    height="118"
    muted
    playsInline
    autoPlay
    loop
    src={selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile.preview}
    className="border border-[#ecf0ff] object-cover rounded"
  />
) : product?.video_url ? (
  <video
    width="100"
    height="118"
    muted
    playsInline
    autoPlay
    loop
    src={product.video_url}
    className="border border-[#ecf0ff] object-cover rounded"
  />
) : (
  <img
    className="w-[100px] h-[118px] border border-[#ecf0ff] object-cover"
    src={image}
    alt="Video Placeholder"
  />
)}

    
    
                
                <div className="flex flex-col gap-2.5">
                    <p className="text-black text-sm font-medium">
                    Min size: 480x480 px. Max video length: 60 seconds. Max file size: 100MB. Supported Format: MP4.
                    </p>
    
                    {/* Upload Button */}
                    <div className="p-2.5 bg-[#ebefff] rounded flex items-center gap-3">
                    <label className="p-4 bg-[#024a63] rounded cursor-pointer text-white text-sm font-medium">
                        Choose File
                        <input type="file" accept="video/mp4" className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="text-[#3b3b3b] text-base font-bold">
                        {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>
    
            
               {/* Reels Upload Section */}
    <div className="flex flex-col gap-3">
      {/* Heading */}
      <div className="flex items-center">
        <span className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">Reels Upload</span>
        <span className="text-[#949494] text-2xl font-bold font-['Montserrat'] leading-loose ml-2">(Optional)</span>
      </div>
      <div className="border-2 border-[#d9d9d9]"></div>
    
      {/* Reel Name */}
      <div className="flex flex-col gap-3">
        <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
          Reel Name
        </label>
        <input
          type="text"
          value={reelName !== "" ? reelName : product?.reel_name || ""}

          onChange={(e) => setReelName(e.target.value)}
          placeholder="Enter reel name..."
          className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs font-normal font-['Montserrat'] leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    
      {/* Upload Section */}
      <div className="h-auto p-5 bg-white rounded-[5px] border border-[#e0e4f4] flex flex-col gap-5">
        <div className="flex items-center gap-5">
         {reelFile ? (
  <video
    width="100"
    height="118"
    muted
    playsInline
    autoPlay
    loop
    src={reelFile instanceof File ? URL.createObjectURL(reelFile) : reelFile.preview}
    className="border border-[#e0e4f4] object-cover rounded"
  />
) : product?.reel_url ? (
  <video
    width="100"
    height="118"
    muted
    playsInline
    autoPlay
    loop
    src={product.reel_url}
    className="border border-[#e0e4f4] object-cover rounded"
  />
) : (
  <img
    className="w-[100px] h-[118px] border border-[#e0e4f4] object-cover rounded"
    src={image}
    alt="Reel Placeholder"
  />
)}

    
          <div className="flex flex-col gap-2.5">
            <p className="text-black text-sm font-medium font-['Montserrat'] leading-tight">
              Min size: 480x480 px. Max video length: 30 seconds. Max file size: 100MB. Supported Format: MP4
            </p>
    
            {/* File Upload Button */}
            <div className="p-2.5 bg-[#ebefff] rounded-[5px] flex items-center gap-3">
              <label
                htmlFor="reel-upload"
                className="p-4 bg-[#024a63] text-white text-sm font-medium font-['Montserrat'] rounded cursor-pointer"
              >
                Choose File
              </label>
              <input
                type="file"
                id="reel-upload"
                accept="video/mp4"
                className="hidden"
                onChange={handleReelFileChange}
              />
              <span className="text-[#3b3b3b] text-base font-bold font-['Montserrat'] leading-normal">
                {fileName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
                {/* Shipping & Warranty Section */}
                <div className="flex flex-col gap-3">
            {/* Heading */}
            <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">Shipping & Warranty</div>
            <div className="border-2 border-[#d9d9d9]"></div>
    
            {/* Form Fields */}
            <div className="flex flex-wrap gap-3">
                {/* Package Weight */}
                <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
                <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
                    Package Weight
                </label>
                <input
                    type="number"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
    
                {/* Select Gram / KG */}
                <div className="flex flex-col gap-3 w-[150px]">
                <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
                    Select Gram / KG
                </label>
                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="gram">Gram</option>
                    <option value="kg">KG</option>
                </select>
                </div>
    
                {/* Warranty Type */}
                <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
                <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
                    Warranty Type
                </label>
                <select
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Select Warranty</option>
                    <option value="no-warranty">No Warranty</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="2-years">2 Years</option>
                </select>
                </div>
            </div>
            </div>
    
            
    
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
        <button onClick={()=>card1(null)} className="px-4 py-2 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium font-['Montserrat'] leading-none">
            Cancel
        </button>
       <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className={`h-12 px-4 py-2 rounded text-white text-sm font-medium font-['Montserrat'] leading-none flex items-center gap-2
        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#024a63]'}`}
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          {product ? "Updating..." : "Submitting..."}
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {product ? "Update Product" : "Add Product"}
        </>
      )}
    </button>
    
    
        </div>
    
            </div>
            </div>
  );
};

export default EditProduct;