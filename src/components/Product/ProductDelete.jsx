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
      <div className="relative w-[600px] p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-in fade-in zoom-in duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[#1b1b1b] text-2xl font-bold tracking-tight">Reject Product</div>
          <button onClick={close} className="text-gray-400 hover:text-rose-500 transition-colors">
            <IoMdCloseCircleOutline size={32} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-6">

          {/* REASON SELECT */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Rejection Reason
            </label>
            <select
              className="w-full h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
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
              className="w-full h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="Or type a custom reason..."
              maxLength={maxChars}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Detailed Description (Required)
            </label>
            <textarea
              className="w-full h-32 px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
              placeholder="Provide more details for the seller..."
              maxLength={maxChars}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="text-right text-[10px] font-bold text-gray-400">
              {description.length} / {maxChars}
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button 
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" 
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2.5 bg-[#024a63] text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-900/20 hover:bg-[#035a78] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            disabled={(!selectedReason && !customReason.trim()) || !description.trim()}
            onClick={handleDelete}
          >
            Reject Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDelete;
