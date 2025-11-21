import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";


const ProductDelete = ({ close, onDelete }) => {

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const maxChars = 300;
  const [selectedReason, setSelectedReason] = useState("");
const [customReason, setCustomReason] = useState("");


  const predefinedReasons = [
    "Multiple Account Abuse",
    "Fraudulent Activity",
    "Inappropriate Behavior",
    "Spam or Misleading Information",
  ];

  const handleDelete = async () => {

  const finalReason = customReason.trim() !== "" ? customReason : selectedReason;

  if (!finalReason) {
    return Swal.fire({
      icon: "warning",
      title: "Reason Required",
      text: "Please select or type a reason before deleting.",
    });
  }

  if (!description.trim()) {
    return Swal.fire({
      icon: "warning",
      title: "Description Required",
      text: "Please write a description.",
    });
  }

  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This account will be moved to trash permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#024a63",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Trash it",
  });

  if (!confirmation.isConfirmed) return;

  await onDelete(finalReason, description);

  close();
};


  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">

      {/* Overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md"
        onClick={close}
      />

      {/* MODAL */}
      <div className="relative w-[742px] p-6 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col z-50">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="text-black text-2xl font-bold">Trash Account</div>
          <button onClick={close}>
            <IoMdCloseCircleOutline size={28} />
          </button>
        </div>

        <div className="border-t border-[#d9d9d9] my-2"></div>

        {/* CONTENT */}
        <div className="flex flex-col flex-grow">

          {/* REASON SELECT + Input */}
          <div>
            <div className="text-black text-[10px] font-bold uppercase tracking-widest">
              Select or Type Reason
            </div>

            <select
  className="w-full h-12 px-3 mt-1 border border-[#e0e4f4] text-xs rounded"
  value={selectedReason}
  onChange={(e) => setSelectedReason(e.target.value)}
>
  <option value="">-- Select a reason --</option>
  {predefinedReasons.map((r, i) => (
    <option key={i} value={r}>
      {r}
    </option>
  ))}
</select>

<input
  type="text"
  className="w-full mt-3 h-12 px-3 border border-[#cfd2e3] rounded text-xs"
  placeholder="Or type your own reason..."
  maxLength={maxChars}
  value={customReason}
  onChange={(e) => setCustomReason(e.target.value)}
/>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-3">
            <div className="text-black text-[10px] font-bold uppercase tracking-widest">
              Description (Required)
            </div>
            <textarea
              className="w-full h-[140px] px-3 py-2 mt-1 border border-[#d9d9d9] rounded text-xs resize-none"
              placeholder="Write additional details..."
              maxLength={maxChars}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="text-right text-[10px] font-bold">
              {description.length}/{maxChars}
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="p-3 bg-[#bbbbbb] rounded text-sm" onClick={close}>
            Cancel
          </button>
          <button
            className="p-3 bg-[#024a63] text-white rounded text-sm disabled:opacity-50"
           disabled={(!selectedReason && !customReason.trim()) || !description.trim()}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDelete;
