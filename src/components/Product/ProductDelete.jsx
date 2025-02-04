import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import IconCheckSquareBroken from '../../assets/images/IconCheckSquareBroken.png'

const ProductDelete = ({ close, onDelete }) => {
  const [reason, setReason] = useState("Multiple Account Abuse");
  const [description, setDescription] = useState("");
  const [deleted, setDeleted] = useState(false);
  const maxChars = 300;

  const reasons = [
    "Multiple Account Abuse",
    "Fraudulent Activity",
    "Inappropriate Behavior",
    "Spam or Misleading Information",
  ];

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(reason, description);
    }
    setDeleted(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      {/* Background Blur */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md"
        onClick={close}
      />

      {!deleted ? (
        /* Delete Confirmation Modal */
        <div className="relative w-[742px] h-[438px] p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col z-50">
          <div className="flex justify-between items-center">
            <div className="text-black text-2xl font-bold font-['Montserrat']">
              Trash Reason
            </div>
            <button className="text-black text-xl font-bold" onClick={close}>
              <IoMdCloseCircleOutline size={28} />
            </button>
          </div>

          <div className="border-t-2 border-[#d9d9d9] my-2"></div>

          <div className="flex flex-col flex-grow">
            {/* Select Reason */}
            <div className="flex flex-col">
              <div className="text-black text-[10px] font-bold uppercase tracking-widest">
                Select Reason
              </div>
              <select
                className="w-full h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs font-normal"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {reasons.map((r, index) => (
                  <option key={index} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col mt-2">
              <div className="text-black text-[10px] font-bold uppercase tracking-widest">
                Description
              </div>
              <textarea
                className="w-full h-[146px] px-3 py-2 bg-white rounded border border-[#d9d9d9] text-black text-xs font-normal resize-none"
                value={description}
                placeholder="refers to the creation or use of multiple accounts by a single user to exploit platform features, manipulate outcomes (e.g., votes, reviews), or evade restrictions and penalties. This behavior violates fair usage policies and undermines the integrity of the platform."
                onChange={(e) => setDescription(e.target.value)}
                maxLength={maxChars}
              />
              <div className="text-right text-black text-[10px] font-bold uppercase tracking-widest">
                {description.length}/{maxChars}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className="p-4 bg-[#024a63] rounded text-white text-sm font-medium"
              disabled={!description.trim()}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
       
        <div className="w-full max-w-[742px] min-h-[285px] p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col items-center z-50">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <div className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat']">
            Successfully Trash
          </div>
          <button className="text-black text-xl font-bold" onClick={close}>
            <IoMdCloseCircleOutline size={28} />
          </button>
        </div>
      
        {/* Divider */}
        <div className="w-full h-[2px] bg-[#d9d9d9] my-4"></div>
      
        {/* Success Icon */}
        <div className="flex justify-center items-center">
          <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]">
            <img src={IconCheckSquareBroken} alt="Success Icon" className="w-full h-full object-contain" />
          </div>
        </div>
      
        {/* Message */}
        <div className="text-center text-[#024a63] text-lg sm:text-xl md:text-2xl font-bold font-['Montserrat'] mt-4">
          You Have Successfully Trashed the Account!
        </div>
      
        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button className="w-full sm:w-auto p-4 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium" onClick={close}>
            Cancel
          </button>
          <button className="w-full sm:w-auto p-4 bg-[#024a63] rounded text-white text-sm font-medium" onClick={close}>
            Continue
          </button>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default ProductDelete;
