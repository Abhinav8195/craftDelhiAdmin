import React, { useState } from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import { IoMdCloudUpload } from "react-icons/io";


const SellerStoreinfo = ({card1}) => {
  const [formData, setFormData] = useState({
    storeName: "Craft Delhi India",
    storeId: "1043",
    storeLink: "https://www.etsy.com/shop/YourShopName",
    description: "I would like this order delivered on my friend’s anniversary. Could you ensure it arrives on the 25th in the morning?",
    storeCreatedDate: "dd - mm - yyyy",
    businessNumber: "0313 -3763603",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Save)
  const handleSave = () => {
    console.log("Form Data Saved:", formData);
  };

  // Handle form reset (Cancel)
  const handleCancel = () => {
    card1(null)
    setFormData({
      storeName: "",
      storeId: "",
      storeLink: "",
      description: "",
      storeCreatedDate: "",
      businessNumber: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3">
      <div className="w-full max-w-[980px]  p-5 bg-white rounded-xl mt-[-80px] ">
        {/* Header */}
        <div className="self-stretch flex flex-col gap-3">
          <h2 className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">
            General Information :
          </h2>
          <div className="w-full border-2 border-[#d9d9d9]"></div>
        </div>

        {/* Profile & Form */}
        <div className="mt-6 flex flex-col gap-3">
        <div className=" flex flex-col sm:flex-row items-center gap-5">
  <label htmlFor="profile-upload" className=" cursor-pointer">
    <img className="w-24 h-24 rounded-full" src={Ellipse} alt="Profile" />
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2   rounded-full shadow">
      <IoMdCloudUpload className="text-xl text-white" />
    </div>
  </label>
  <input type="file" id="profile-upload" className="hidden" />
</div>


          <div className="flex flex-col gap-3">
            {/* Store Name, ID & Link */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[250px]">
                <label className="text-black text-[10px] font-bold uppercase tracking-widest">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-xs w-full"
                />
              </div>

              <div className="w-[117px]">
                <label className="text-black text-[10px] font-bold uppercase tracking-widest">Store ID</label>
                <input
                  type="text"
                  name="storeId"
                  value={formData.storeId}
                  onChange={handleChange}
                  className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-xs w-full"
                />
              </div>

              <div className="flex-1 min-w-[250px]">
                <label className="text-black text-[10px] font-bold uppercase tracking-widest">Store Link</label>
                <input
                  type="text"
                  name="storeLink"
                  value={formData.storeLink}
                  onChange={handleChange}
                  className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-xs w-full"
                />
              </div>
            </div>

            {/* Store Description */}
            <div className="flex flex-col gap-3">
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

            {/* Store Created Date & Business Number */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[250px]">
                <label className="text-black text-[10px] font-bold uppercase tracking-widest">Store Created Date</label>
                <DateInputField label="Birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
              </div>

              <div className="flex-1 min-w-[250px]">
                <label className="text-black text-[10px] font-bold uppercase tracking-widest">Business Number</label>
                <input
                  type="text"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-xs w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={handleCancel} className="p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleSave} className=" p-4 bg-[#024a63] rounded text-white text-sm font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};


const DateInputField = ({ label, name, value, onChange }) => {
    return (
      <div>
       
        <div className="relative w-full">
          <input
            type="date"
            className="w-full h-14 px-3  bg-white rounded border border-[#e0e4f4] text-xs"
            name={name}
            value={value}
            onChange={onChange}
          />
         
        </div>
      </div>
    );
  };

export default SellerStoreinfo;
