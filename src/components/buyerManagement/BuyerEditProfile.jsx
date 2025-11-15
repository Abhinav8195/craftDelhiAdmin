import React, { useState } from "react";
import axios from "axios";
import { getAdminToken } from "../../utils/auth";
import { toast } from "react-toastify";

const BuyerEditProfile = ({ buyer, card1 }) => {
  const token = getAdminToken();

  const formatDate = (date) => (date ? date.split("T")[0] : "");

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    user_id: buyer?.userId || "",
    first_name: buyer?.first_name || "",
    last_name: buyer?.last_name || "",
    email: buyer?.email || "",
    phone_number: buyer?.phone || "",
    date_of_birth: formatDate(buyer?.date_of_birth),
    gender: buyer?.gender !== undefined ? Number(buyer.gender) : 0,
    city: buyer?.city || "",
    street: buyer?.street || "",
    state: buyer?.state || "",
    country: buyer?.country || "",
    postal_code: buyer?.postal_code || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "gender" ? Number(value) : value,
    });

    setErrors({ ...errors, [name]: false });
  };

  const handleSave = async () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] === "") newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}admin/update-buyerbyadmin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile Updated Successfully");
        card1(null);
      } else toast.error(res.data.message || "Something went wrong");
    } catch {
      toast.error("Failed to update details");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl shadow-lg">

        <h2 className="text-black text-2xl font-bold mb-2">Profile Information :</h2>
        <div className="border-b-2 border-[#d9d9d9] mb-4"></div>

        {/* Profile Image (View Only) */}
        <div className="flex justify-left mb-6">
          <img
            className="w-24 h-24 rounded-full object-cover border border-gray-400"
            src={buyer?.profileImage || "https://www.cielhr.com/wp-content/uploads/2020/10/dummy-image.jpg"}
            alt="Profile"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} errors={errors} />
          <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} errors={errors} />
          <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} errors={errors} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <InputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} errors={errors} />
          <InputField label="Birthday" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} errors={errors} />
          <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} errors={errors} />
        </div>

        <h2 className="text-black text-2xl font-bold mt-8 mb-3">Shipping Information :</h2>
        <div className="border-b-2 border-[#d9d9d9] mb-4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="City" name="city" value={formData.city} onChange={handleChange} errors={errors} />
          <InputField label="Street" name="street" value={formData.street} onChange={handleChange} errors={errors} />
          <InputField label="State" name="state" value={formData.state} onChange={handleChange} errors={errors} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <InputField label="Country" name="country" value={formData.country} onChange={handleChange} errors={errors} />
          <InputField label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} errors={errors} />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={() => card1(null)} className="px-6 py-2 bg-gray-400 text-black rounded">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#024a63] text-white rounded">Save</button>
        </div>

      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", errors }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <input
      className={`w-full h-12 px-3 bg-white rounded border text-xs 
        ${errors?.[name] ? "border-red-500" : "border-[#e0e4f4]"}`}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, errors }) => (
  <div>
    <label className="text-black text-xs font-bold uppercase">{label}</label>
    <select
      className={`w-full h-12 px-3 bg-white rounded border text-xs ${
        errors?.[name] ? "border-red-500" : "border-[#e0e4f4]"
      }`}
      name={name}
      value={value}
      onChange={(e) => onChange({ target: { name, value: Number(e.target.value) } })}
    >
      <option value={0}>Male</option>
      <option value={1}>Female</option>
      <option value={2}>Other</option>
    </select>
  </div>
);

export default BuyerEditProfile;
