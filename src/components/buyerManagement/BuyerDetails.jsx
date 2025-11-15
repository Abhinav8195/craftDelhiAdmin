import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { MdPauseCircle } from "react-icons/md";

const BuyerDetails = ({ user, close }) => {

  const fullAddress = `${user.street || ""}, ${user.city || ""}, ${user.state || ""}, ${user.country || ""} - ${user.postal_code || ""}`.replace(/,\s*,/g, ",");

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getGender = (value) => {
    return value === 0 ? "Male" : value === 1 ? "Female" : "Other";
  };

  const renderStatus = () => {
    if (user.status === 1) {
      return (
        <span className="flex items-center gap-2 text-green-600 font-semibold">
          <FaUserCheck /> Active
        </span>
      );
    } else if (user.status === 0) {
      return (
        <span className="flex items-center gap-2 text-yellow-500 font-semibold">
          <MdPauseCircle /> Inactive
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-2 text-red-600 font-semibold">
          <FaTrash /> Trashed
        </span>
      );
    }
  };

  return (
    <div className="w-full max-w-[883px] h-auto p-5 bg-white rounded-xl shadow-lg border border-[#d9d9d9] flex flex-col items-start gap-4 overflow-y-auto">

      <div className="w-full flex justify-between items-center">
        <h2 className="text-black text-2xl font-bold">Profile View</h2>
        <button className="text-2xl" onClick={close}><IoMdCloseCircleOutline size={28} /></button>
      </div>

      <div className="w-full border-t-2 border-[#d9d9d9]"></div>

      {/* Buyer Information */}
      <div className="w-full flex flex-col gap-2.5">
        <h3 className="text-black text-base font-bold">Buyer Information:</h3>

        <img
          className="w-16 h-16 rounded-full border border-gray-400"
          src={user.profileImage || "https://www.cielhr.com/wp-content/uploads/2020/10/dummy-image.jpg"}
          alt={user.name}
        />

        <div className="w-full border border-[#ecf0ff]"></div>

        {[
          { label: "User ID", value: user.userId },
          { label: "Buyer Name", value: user.name },
          { label: "Email Address", value: user.email },
          { label: "Contact Number", value: user.phone },
          { label: "Birthday", value: formatDate(user.date_of_birth) },
          { label: "Gender", value: getGender(user.gender) },
        ].map((item, index) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <div className="flex gap-5">
              <span className="w-40 text-[#024a63] text-sm font-bold">{item.label}:</span>
              <span className="text-black text-sm font-medium">{item.value}</span>
            </div>
            <div className="w-full border border-[#ecf0ff]"></div>
          </div>
        ))}

        {/* Status UI with Icons */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-5">
            <span className="w-40 text-[#024a63] text-sm font-bold">Status:</span>
            {renderStatus()}
          </div>
          <div className="w-full border border-[#ecf0ff]"></div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="w-full flex flex-col gap-2.5">
        <h3 className="text-black text-base font-bold">Shipping Information:</h3>

        {[
          { label: "Full Address", value: fullAddress || "N/A" },
          { label: "State", value: user.state || "N/A" },
          { label: "City", value: user.city || "N/A" },
          { label: "Street", value: user.street || "N/A" },
          { label: "Country", value: user.country || "N/A" },
          { label: "Postal Code", value: user.postal_code || "N/A" }
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

      <div className="w-full flex justify-end">
        <button onClick={close} className="w-32 p-3 bg-[#024a63] rounded text-white text-sm font-medium">
          Close
        </button>
      </div>
    </div>
  );
};

export default BuyerDetails;
