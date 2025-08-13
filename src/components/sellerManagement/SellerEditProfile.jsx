import React, { useEffect, useState } from "react";
import Ellipse from '../../assets/images/Ellipse.png';
import { IoMdCloudUpload } from "react-icons/io";

const SellerEditProfile = ({ card1, seller }) => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    contact: "",
    birthday: "",
    gender: "",
    address: "",
    home: "",
    profileImage: ""
  });

  // Fill data when seller prop is available
  useEffect(() => {
    if (seller) {
      setFormData({
        userId: seller.userId || seller.user_id || "",
        name: seller.name || `${seller.first_name || ""} ${seller.last_name || ""}`,
        email: seller.email || "",
        contact: seller.phone || seller.phone_number || "",
        birthday: seller.date_of_birth ? seller.date_of_birth.split("T")[0] : "",
        gender: seller.gender || "",
        address: seller.office_address || "",
        home: seller.home_address || "",
        profileImage: seller.profile_image || ""
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl">
        {/* Profile Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-black text-2xl font-bold">Profile Information :</h2>
          </div>
          <div className="border-b-2 border-[#d9d9d9] mb-4"></div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label htmlFor="profile-upload" className="cursor-pointer relative">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={formData.profileImage || Ellipse}
                alt="Profile"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full bg-black p-1 shadow">
                <IoMdCloudUpload className="text-xl text-white" />
              </div>
            </label>
            <input type="file" id="profile-upload" className="hidden" />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="User ID" name="userId" value={formData.userId} onChange={handleChange} />
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InputField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />
          <DateInputField label="Birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
        </div>

        {/* Addresses */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="text-black text-xs font-bold uppercase">OFFICE ADDRESS</label>
            <textarea
              className="w-full h-[106px] p-3 bg-white rounded border border-[#d9d9d9] text-xs"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="text-black text-xs font-bold uppercase">HOME ADDRESS</label>
            <textarea
              className="w-full h-[106px] p-3 bg-white rounded border border-[#d9d9d9] text-xs"
              name="home"
              value={formData.home}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={() => card1(null)} className="px-6 py-2 bg-gray-400 text-black rounded">Cancel</button>
          <button className="px-6 py-2 bg-[#024a63] text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

// Input Components
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <input
      className="w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

const DateInputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <input
      type="date"
      className="w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <select
      className="w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Prefer not to say">Prefer not to say</option>
    </select>
  </div>
);

export default SellerEditProfile;
