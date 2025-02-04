import React from "react";
import Ellipse from "../../assets/images/Ellipse.png";
import { IoMdCloudUpload } from "react-icons/io";

const SellerBank = ({card1}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3 ">
    <div className="w-full max-w-[980px] mx-auto p-5 bg-white rounded-xl  mt-[-120px] ">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">
          Bank Information :
        </h2>
        <div className="w-full border-2 border-[#d9d9d9]"></div>
      </div>

      {/* Profile & Form */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Profile Picture with Upload Icon */}
        <div className=" flex flex-col sm:flex-row items-center gap-5">
          <label htmlFor="profile-upload" className=" cursor-pointer">
            <img className="w-24 h-24 rounded-full" src={Ellipse} alt="Profile" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2   rounded-full shadow">
              <IoMdCloudUpload className="text-xl text-white" />
            </div>
          </label>
          <input type="file" id="profile-upload" className="hidden" />
        </div>

        {/* Form Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Select Bank
              </label>
              <input type="text" defaultValue="State Bank of India" className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs" />
            </div>

            {/* Branch Location */}
            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Branch Location
              </label>
              <input type="text" defaultValue="Connaught Place, New Delhi" className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Holder Name */}
            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Account Holder Name
              </label>
              <input type="text" defaultValue="Rahul Sharma" className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs" />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-black text-[10px] font-bold uppercase tracking-widest">
                Account Number
              </label>
              <input type="text" defaultValue="123456789012" className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs" />
            </div>
          </div>

          {/* IFSC Code */}
          <div>
            <label className="text-black text-[10px] font-bold uppercase tracking-widest">
              IFSC Code
            </label>
            <input type="text" defaultValue="SBIN0001234" className="h-14 px-3 bg-white rounded border border-[#e0e4f4] w-full text-xs" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={()=>card1(null)} className="p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium">
          Cancel
        </button>
        <button className="p-4 bg-[#024a63] rounded text-white text-sm font-medium">
          Save
        </button>
      </div>
    </div>
    </div>
  );
};

export default SellerBank;
