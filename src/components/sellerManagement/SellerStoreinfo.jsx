import React, { useEffect, useState } from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import { IoMdCloudUpload } from "react-icons/io";

const SellerStoreinfo = ({ card1, seller }) => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeId: "",
    storeLink: "",
    description: "",
    storeCreatedDate: "",
    businessNumber: "",
    storeImage: ""
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        storeName: seller.store_name || "",
        storeId: seller.store_id || "",
        storeLink: seller.store_link || "",
        description: seller.description || "",
        storeCreatedDate: seller.store_created_date
          ? seller.store_created_date.split("T")[0]
          : "",
        businessNumber: seller.business_number || "",
        storeImage: seller.store_image || ""
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Form Data Saved:", formData);
  };

  const handleCancel = () => {
    card1(null);
  };

  return (
    <div className="w-full bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-black text-2xl font-bold">General Information :</h2>
          <div className="w-full border-2 border-[#d9d9d9]"></div>
        </div>

        {/* Profile & Form */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label htmlFor="profile-upload" className="cursor-pointer relative">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={formData.storeImage || Ellipse}
                alt="Store"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full bg-black p-1 shadow">
                <IoMdCloudUpload className="text-xl text-white" />
              </div>
            </label>
            <input type="file" id="profile-upload" className="hidden" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <InputField
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />

              <InputField
                label="Store ID"
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                small
              />

              <InputField
                label="Store Link"
                name="storeLink"
                value={formData.storeLink}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Description About Store
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="h-[106px] px-3 py-2 bg-white rounded border border-[#d9d9d9] text-black text-xs w-full"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <DateInputField
                label="Store Created Date"
                name="storeCreatedDate"
                value={formData.storeCreatedDate}
                onChange={handleChange}
              />

              <InputField
                label="Business Number"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={handleCancel}
            className="p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-4 bg-[#024a63] rounded text-white text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, small }) => (
  <div className={small ? "w-[117px]" : "flex-1 min-w-[250px]"}>
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full"
    />
  </div>
);

const DateInputField = ({ label, name, value, onChange }) => (
  <div className="flex-1 min-w-[250px]">
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">
      {label}
    </label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
    />
  </div>
);

export default SellerStoreinfo;
