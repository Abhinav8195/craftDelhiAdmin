import React, { useEffect, useState } from "react";
import Ellipse from "../../assets/images/d1.png";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const SellerStoreinfo = ({ card1, seller }) => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    storeName: "",
    storeId: "",
    storeLink: "",
    description: "",
    storeCreatedDate: "",
    businessNumber: "",
    storeImage: "",
    userId: ""
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        storeName: seller.store_name || "",
        storeId: seller.store_id || "",
        storeLink: seller.store_link || "",
        description: seller.description || "",
        storeCreatedDate: seller.store_created_date ? seller.store_created_date.split("T")[0] : "",
        businessNumber: seller.business_number || "",
        storeImage: seller.store_image || Ellipse,
        userId: seller.user_id || ""
      });
    }
  }, [seller]);

  const validate = () => {
    let newErrors = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required.";
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = "Store name must be at least 3 characters.";
    }

    if (!formData.storeCreatedDate) {
      newErrors.storeCreatedDate = "Store created date is required.";
    }

    if (!/^\d{10}$/.test(formData.businessNumber)) {
      newErrors.businessNumber = "Business number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return toast.error("Please fix errors before saving.");

    try {
      const fd = new FormData();
      fd.append("user_id", formData.userId);
      fd.append("store_name", formData.storeName);
      fd.append("description", formData.description);
      fd.append("store_created_date", formData.storeCreatedDate);
      fd.append("business_number", formData.businessNumber);

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update-sellerbyadmin`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
          },
        }
      );

      toast.success(res.data.message || "Store information updated successfully!");
      card1(null);
    } catch (err) {
      toast.error("Failed to update store information.");
    }
  };

  return (
    <div className="w-full bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl">

        <div className="flex flex-col gap-3">
          <h2 className="text-black text-2xl font-bold">General Information :</h2>
          <div className="w-full border-2 border-[#d9d9d9]"></div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="cursor-not-allowed ">
  <img
                className="w-24 h-24 rounded-full object-cover"
                src={formData.storeImage || Ellipse}
                alt="Store"
              />

</div>

          <p className="text-sm text-gray-500 italic">Store image cannot be changed.</p>
        </div>

          <div className="flex flex-col gap-3">

            <div className="flex flex-wrap gap-3">
              <InputField
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))}
                error={errors.storeName}
              />

              <InputField label="Store ID" value={formData.storeId} readOnly small />
              <InputField label="Store Link" value={formData.storeLink} readOnly />
            </div>

            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Description About Store
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))}
                className="h-[106px] px-3 py-2 bg-white rounded border border-[#d9d9d9] text-black text-xs w-full"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <DateInputField
                label="Store Created Date"
                name="storeCreatedDate"
                value={formData.storeCreatedDate}
                onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))}
                error={errors.storeCreatedDate}
              />

              <InputField
                label="Business Number"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))}
                error={errors.businessNumber}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={()=>card1(null)} className="p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleSave} className="p-4 bg-[#024a63] rounded text-white text-sm font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, small, readOnly, error }) => (
  <div className={small ? "w-[117px]" : "flex-1 min-w-[250px]"}>
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full"
    />
    {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
  </div>
);

const DateInputField = ({ label, name, value, onChange, error }) => (
  <div className="flex-1 min-w-[250px]">
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
    />
    {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
  </div>
);

export default SellerStoreinfo;
