import React, { useState, useEffect } from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerBank = ({ card1, seller }) => {
  const [formData, setFormData] = useState({
    bankName: "",
    branchLocation: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    profileImage: "",
    profileImageFile: null,
    userId: ""
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        bankName: seller.bank_name || "",
        branchLocation: seller.branch_location || "",
        accountHolder: seller.account_holder_name || "",
        accountNumber: seller.account_number || "",
        ifscCode: seller.ifsc_code || "",
        profileImage: seller.profile_image || "",
        profileImageFile: null,
        userId: seller.user_id || ""
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append("user_id", formData.userId);

      if (formData.bankName) fd.append("bank_name", formData.bankName);
      if (formData.branchLocation) fd.append("branch_location", formData.branchLocation);
      if (formData.accountHolder) fd.append("account_holder_name", formData.accountHolder);
      if (formData.accountNumber) fd.append("account_number", formData.accountNumber);
      if (formData.ifscCode) fd.append("ifsc_code", formData.ifscCode);
      if (formData.profileImageFile) fd.append("profile_image", formData.profileImageFile);

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update-sellerbyadmin`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success(res.data.message || "Bank details updated successfully!");
      card1(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bank details.");
    }
  };

  return (
    <div className="w-full p-3 bg-white">
      <div className="w-full max-w-[980px] mx-auto p-5 bg-white rounded-xl">
        <div className="flex flex-col gap-3">
          <h2 className="text-black text-2xl font-bold">Bank Information :</h2>
          <div className="w-full border-2 border-[#d9d9d9]"></div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label htmlFor="profile-upload" className="cursor-pointer relative">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={formData.profileImage || Ellipse}
                alt="Profile"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full shadow bg-[#00000099] p-1">
                <IoMdCloudUpload className="text-xl text-white" />
              </div>
            </label>
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Select Bank"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
              <InputField
                label="Branch Location"
                name="branchLocation"
                value={formData.branchLocation}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Account Holder Name"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
              />
              <InputField
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => card1(null)}
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

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs"
    />
  </div>
);

export default SellerBank;
