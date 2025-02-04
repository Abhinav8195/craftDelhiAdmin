import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import IconTrash_01 from '../../assets/images/IconTrash_01.png'

const PaymentDelete = ({ close, onDelete }) => {


  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md"
        onClick={close}
      />

     
       
        <div className="w-full max-w-[742px] min-h-[285px] p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col items-center z-50">
        <div className="w-full flex justify-between items-center">
          <div className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat']">
            Delete Payment
          </div>
          <button className="text-black text-xl font-bold" onClick={close}>
            <IoMdCloseCircleOutline size={28} />
          </button>
        </div>
      
        {/* Divider */}
        <div className="w-full h-[2px] bg-[#d9d9d9] my-4"></div>
      
        {/* Success Icon */}
        <div className="flex justify-center items-center mx-auto">
          <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]">
            <img src={IconTrash_01} alt="Success Icon" className="w-50 h-50 object-contain" />
          </div>
        </div>
      
        {/* Message */}
        <div className="text-center text-[#024a63] text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat'] mt-4">
        Are you sure do you want to delete Payment ?
        </div>
      
        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button className="w-full sm:w-auto p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium" onClick={close}>
            Cancel
          </button>
          <button className="w-full sm:w-auto p-4 bg-[#024a63] rounded text-white text-sm font-medium" onClick={close}>
            Delete
          </button>
        </div>
      </div>
      
      
    </div>
  );
};

export default PaymentDelete;
