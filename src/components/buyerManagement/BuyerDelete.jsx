import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import IconCheckSquareBroken from '../../assets/images/IconCheckSquareBroken.png';

const BuyerDelete = ({ close, onDelete }) => {
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

  const handleDelete = async () => {
    if (typeof onDelete === "function") {
      await onDelete(reason, description); // pass reason & description to API
      setDeleted(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md"
        onClick={close}
      />

      {!deleted ? (
        <div className="relative w-[742px] h-[438px] p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col z-50">
          <div className="flex justify-between items-center">
            <div className="text-black text-2xl font-bold">Trash Reason</div>
            <button onClick={close}>
              <IoMdCloseCircleOutline size={28} />
            </button>
          </div>

          <div className="border-t-2 border-[#d9d9d9] my-2"></div>

          <div className="flex flex-col flex-grow">
            <div className="flex flex-col">
              <div className="text-black text-[10px] font-bold uppercase tracking-widest">
                Select Reason
              </div>
              <select
                className="w-full h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs"
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

            <div className="flex flex-col mt-2">
              <div className="text-black text-[10px] font-bold uppercase tracking-widest">
                Description
              </div>
              <textarea
                className="w-full h-[146px] px-3 py-2 bg-white rounded border border-[#d9d9d9] text-xs resize-none"
                value={description}
                placeholder="Provide details for the trash reason..."
                onChange={(e) => setDescription(e.target.value)}
                maxLength={maxChars}
              />
              <div className="text-right text-[10px] font-bold uppercase">
                {description.length}/{maxChars}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="p-4 bg-[#bbbbbb] rounded text-sm font-medium"
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
          <div className="w-full flex justify-between items-center">
            <div className="text-black text-xl font-bold">Successfully Trashed</div>
            <button onClick={close}>
              <IoMdCloseCircleOutline size={28} />
            </button>
          </div>

          <div className="w-full h-[2px] bg-[#d9d9d9] my-4"></div>

          <div className="flex justify-center items-center">
            <img src={IconCheckSquareBroken} alt="Success" className="w-[100px] h-[100px]" />
          </div>

          <div className="text-center text-[#024a63] text-xl font-bold mt-4">
            You Have Successfully Trashed the Account!
          </div>

          <div className="w-full flex justify-end gap-2 mt-6">
            <button className="p-4 bg-[#bbbbbb] rounded text-sm font-medium" onClick={close}>
              Cancel
            </button>
            <button className="p-4 bg-[#024a63] rounded text-white text-sm font-medium" onClick={close}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDelete;
