import React, { useEffect, useState } from "react";
import Ellipse from "../../assets/images/d1.png";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
const genderOptions = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Prefer not to say", value: 2 },
];

const SellerEditProfile = ({ card1, seller }) => {
  const [errors, setErrors] = useState({});
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
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        userId: seller.userId || seller.user_id || "",
        name: seller.fullName || seller.name || "",
        email: seller.email || "",
        contact: seller.phone || seller.phone_number || "",
        birthday: seller.dob ? seller.dob.split("T")[0] : "",
       gender: seller.gender !== undefined && seller.gender !== null ? Number(seller.gender) : "",
        address: seller.office_address || "",
        home: seller.home_address || "",
        profileImage: seller.profileImage || Ellipse,
      });
    }
  }, [seller]);

  // VALIDATION RULES
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters.";

    if (!/^\d{10}$/.test(formData.contact))
      newErrors.contact = "Phone must be 10 digits.";

    if (formData.gender === "" || formData.gender === null || formData.gender === undefined) {
  newErrors.gender = "Please select gender.";
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
     if (!validate()) return toast.error("Fix errors before saving.");

    try {
      const fd = new FormData();
      fd.append("user_id", formData.userId);

      const [firstName, ...rest] = formData.name.split(" ");
      fd.append("first_name", firstName);
      fd.append("last_name", rest.join(" "));

      fd.append("phone_number", formData.contact);
      fd.append("gender", formData.gender);
      fd.append("office_address", formData.address);
      fd.append("home_address", formData.home);

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update-sellerbyadmin`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
          },
        }
      );

      toast.success(res.data.message || "Profile updated successfully");
      card1(null);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl">

        <h2 className="text-black text-2xl font-bold mb-2">Profile Information :</h2>
        <div className="border-b-2 border-[#d9d9d9] mb-4"></div>

        {/* PROFILE IMAGE (Upload Disabled but UI same) */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="cursor-not-allowed ">
  <img className="w-24 h-24 rounded-full object-cover z-0" src={formData.profileImage} alt="Profile"/>

</div>

          <p className="text-sm text-gray-500 italic">Profile image cannot be changed.</p>
        </div>

        {/* 1st Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <InputField label="User ID" name="userId" value={formData.userId} readOnly />
          <InputField label="Name" name="name" value={formData.name} onChange={setFormData} error={errors.name}/>
          <InputField label="Email Address" name="email" value={formData.email} readOnly />
        </div>

        {/* 2nd Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <InputField label="Contact Number" name="contact" value={formData.contact} onChange={setFormData} error={errors.contact}/>
          <InputField label="Birthday" name="birthday" value={formData.birthday} readOnly />
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={setFormData} error={errors.gender}/>
        </div>

        {/* ADDRESS */}
        <Textarea label="Office Address" name="address" value={formData.address} onChange={setFormData}/>
        <Textarea label="Home Address" name="home" value={formData.home} onChange={setFormData}/>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={()=>card1(null)} className="px-6 py-2 bg-gray-400 text-black rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#024a63] text-white rounded">
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

// INPUT COMPONENT UI KEEP SAME
const InputField = ({ label, name, value, onChange, readOnly = false, error }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <input
      name={name}
      value={value}
      readOnly={readOnly}
      onChange={(e)=>onChange((prev)=>({...prev,[name]:e.target.value}))}
      className={`w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs
        ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <textarea
      className="w-full h-[106px] p-3 bg-white rounded border border-[#d9d9d9] text-xs"
      value={value}
      onChange={(e)=>onChange((prev)=>({...prev,[name]:e.target.value}))}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <select
      name={name}
      value={value}
      onChange={(e)=>onChange(prev=>({...prev, [name]: Number(e.target.value)}))}
      className="w-full h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
    >
      <option value="">Select</option>
      {genderOptions.map(g => (
        <option key={g.value} value={g.value}>{g.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default SellerEditProfile;
