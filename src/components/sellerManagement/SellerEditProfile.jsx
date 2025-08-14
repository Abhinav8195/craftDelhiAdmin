import React, { useEffect, useState } from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

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
    profileImage: "",
    profileImageFile: null,
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        userId: seller.userId || seller.user_id || "",
        name: seller.name || `${seller.first_name || ""} ${seller.last_name || ""}`.trim(),
        email: seller.email || "",
        contact: seller.phone || seller.phone_number || "",
        birthday: seller.date_of_birth ? seller.date_of_birth.split("T")[0] : "",
        gender: seller.gender || "",
        address: seller.office_address || "",
        home: seller.home_address || "",
        profileImage: seller.profile_image || "",
        profileImageFile: null,
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
        profileImageFile: file,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append("user_id", formData.userId);

      if (formData.name) {
        const [firstName, ...rest] = formData.name.split(" ");
        fd.append("first_name", firstName);
        fd.append("last_name", rest.join(" "));
      }
      if (formData.email) fd.append("email", formData.email);
      if (formData.contact) fd.append("phone_number", formData.contact);
      if (formData.birthday) fd.append("date_of_birth", formData.birthday);
      if (formData.gender) fd.append("gender", formData.gender);
      if (formData.address) fd.append("office_address", formData.address);
      if (formData.home) fd.append("home_address", formData.home);
      if (formData.profileImageFile) fd.append("profile_image", formData.profileImageFile);

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update-sellerbyadmin`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
     toast.success(res.data.message || "Profile updated successfully!");
      card1(null); 
    } catch (err) {
      console.error(err);
      window.alert("Failed to update profile.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl">
        <h2 className="text-black text-2xl font-bold mb-2">Profile Information :</h2>
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
          <input type="file" id="profile-upload" className="hidden" onChange={handleFileChange} />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* ✅ Make User ID non-editable */}
          <InputField label="User ID" name="userId" value={formData.userId} onChange={handleChange} readOnly />
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <InputField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />
          <DateInputField label="Birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
        </div>

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

        <div className="flex justify-end gap-3">
          <button onClick={() => card1(null)} className="px-6 py-2 bg-gray-400 text-black rounded">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#024a63] text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

// Input Components
const InputField = ({ label, name, value, onChange, readOnly = false }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <input
      className={`w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
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
