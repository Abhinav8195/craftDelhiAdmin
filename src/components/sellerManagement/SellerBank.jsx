import React, { useState, useEffect } from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const indianBanks = [
  "State Bank of India", "Punjab National Bank", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Bank of Baroda", "Union Bank of India", "Canara Bank", "Indian Bank",
  "IDFC First Bank", "IndusInd Bank", "Yes Bank", "Federal Bank", "UCO Bank",
  "Central Bank of India", "Punjab & Sind Bank", "Bank of India", "South Indian Bank",
  "RBL Bank", "Karur Vysya Bank", "Tamilnad Mercantile Bank", "City Union Bank",
  "IDBI Bank", "Dhanlaxmi Bank", "Bandhan Bank", "Jana Small Finance Bank",
  "AU Small Finance Bank", "Fincare Small Finance Bank", "Equitas Small Finance Bank",
  "Suryoday Small Finance Bank"
];

const SellerBank = ({ card1, seller }) => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    bankName: "",
    branchLocation: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    profileImage: "",
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
        profileImage: seller.profile_image || Ellipse,
        userId: seller.user_id || ""
      });
    }
  }, [seller]);

  // -------- Validation ----------
  const validate = () => {
    let errs = {};

    if (!formData.bankName) errs.bankName = "Bank name is required.";

    if (!formData.branchLocation) errs.branchLocation = "Branch location is required.";

    if (!formData.accountHolder.trim())
      errs.accountHolder = "Account holder name is required.";

    if (!/^[0-9]{9,18}$/.test(formData.accountNumber))
      errs.accountNumber = "Account number must be numbers only (9-18 digits).";

    // IFSC: 4 letters + 0 + 6 numbers
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode))
      errs.ifscCode = "Invalid IFSC format (e.g., SBIN0123456).";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return toast.error("Fix errors before saving.");

    try {
      const fd = new FormData();
      fd.append("user_id", formData.userId);
      fd.append("bank_name", formData.bankName);
      fd.append("branch_location", formData.branchLocation);
      fd.append("account_holder_name", formData.accountHolder);
      fd.append("account_number", formData.accountNumber);
      fd.append("ifsc_code", formData.ifscCode);

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update-sellerbyadmin`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("craftdelhiadmin_token")}`,
          },
        }
      );

      toast.success(res.data.message || "Bank details updated successfully!");
      card1(null);
    } catch (err) {
      toast.error("Failed to update bank details.");
    }
  };

  return (
    <div className="w-full p-3 bg-white">
      <div className="w-full max-w-[980px] mx-auto p-5 bg-white rounded-xl">
        <h2 className="text-black text-2xl font-bold">Bank Information :</h2>
        <div className="border-2 border-[#d9d9d9] mb-4"></div>

        <div className="mt-6 flex flex-col gap-3">

          {/* Image Not Editable */}
          <div className="cursor-not-allowed">
            <img className="w-24 h-24 rounded-full object-cover" src={formData.profileImage} alt="" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Select Field */}
            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">Select Bank</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))}
                className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs"
              >
                <option value="">Select</option>
                {indianBanks.map((b,i)=>(<option key={i} value={b}>{b}</option>))}
              </select>
              {errors.bankName && <p className="text-red-500 text-[11px]">{errors.bankName}</p>}
            </div>

            <InputField label="Branch Location" name="branchLocation" value={formData.branchLocation} onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))} error={errors.branchLocation}/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Account Holder Name" name="accountHolder" value={formData.accountHolder} onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))} error={errors.accountHolder}/>
            <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))} error={errors.accountNumber}/>
          </div>

          <InputField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={(e)=>setFormData(prev=>({...prev,[e.target.name]:e.target.value}))} error={errors.ifscCode}/>
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

const InputField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs"
    />
    {error && <p className="text-red-500 text-[11px]">{error}</p>}
  </div>
);

export default SellerBank;
