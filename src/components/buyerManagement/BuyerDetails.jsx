// import React, { useEffect } from 'react';
// import Ellipse from '../../assets/images/Ellipse.png';
import { IoMdCloseCircleOutline } from "react-icons/io";

const BuyerDetails = ({ user,close }) => {
  
  return (
    <div className="w-full max-w-[883px] h-auto p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col items-start gap-4 overflow-y-auto">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-black text-2xl font-bold">Profile View</h2>
        <button className="text-2xl" onClick={close}><IoMdCloseCircleOutline size={28} /></button>
      </div>
      <div className="w-full border-t-2 border-[#d9d9d9]"></div>
      
      {/* Buyer Information */}
      <div className="w-full flex flex-col gap-2.5">
        <h3 className="text-black text-base font-bold">Buyer Information:</h3>
        <img className="w-16 h-16 rounded-full"  src={user.profile_image || "https://via.placeholder.com/150"}
          alt={user.name}
 />
        <div className="w-full border border-[#ecf0ff]"></div>
        
        {[
          { label: "User ID", value:  user.userId },
          { label: "Buyer Name", value: user.name },
          { label: "Email Address", value: user.email },
          { label: "Contact Number", value: user.phone },
          { label: "Birthday", value: "" },
          { label: "Gender", value: "" }
        ].map((item, index) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <div className="flex gap-5">
              <span className="w-40 text-[#024a63] text-sm font-bold">{item.label}:</span>
              <span className="text-black text-sm font-medium">{item.value}</span>
            </div>
            <div className="w-full border border-[#ecf0ff]"></div>
          </div>
        ))}
      </div>
      
      {/* Shipping Information */}
      <div className="w-full flex flex-col gap-2.5">
        <h3 className="text-black text-base font-bold">Shipping Information:</h3>
        {[
          { label: "Full Address", value: "" },
          { label: "State", value: "" },
          { label: "Colony / Locality", value: "" },
          { label: "Area", value: "" }
        ].map((item, index) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <div className="flex gap-5">
              <span className="w-40 text-[#024a63] text-sm font-bold">{item.label}:</span>
              <span className="text-black text-sm font-medium">{item.value}</span>
            </div>
            <div className="w-full border border-[#ecf0ff]"></div>
          </div>
        ))}
      </div>
      
      {/* Close Button */}
      <div className="w-full flex justify-end">
        <button onClick={close} className="w-32 p-3 bg-[#024a63] rounded text-white text-sm font-medium">
          Close
        </button>
      </div>
    </div>
  );
};

export default BuyerDetails;