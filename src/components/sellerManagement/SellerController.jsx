import React, { useState } from "react";
import SellerEditProfile from "./SellerEditProfile";
import BuyerEditProfile from "../buyerManagement/BuyerEditProfile";
import SellerStoreinfo from "./SellerStoreinfo";
import SellerBank from "./SellerBank";

const SellerController = ({card1}) => {
  const [activeTab, setActiveTab] = useState("Basic Information");

  const tabs = ["Basic Information", "Store Information", "Bank Details"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl shadow-lg">
        {/* Tab Navigation */}
        <div className="h-12 p-1 bg-[#ecf0ff] rounded flex">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`grow px-2 py-1 rounded-sm flex justify-center items-center cursor-pointer transition-all duration-200 ${
                activeTab === tab ? "bg-[#ee6f69] text-white font-medium" : "text-black font-normal"
              }`}
            >
              <div className="text-xs font-['Montserrat'] leading-none">{tab}</div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Basic Information" && <SellerEditProfile card1={card1}/>}
          {activeTab === "Store Information" && <SellerStoreinfo card1={card1}/>}
          {activeTab === "Bank Details" && <SellerBank card1={card1} />}
        </div>
      </div>
    </div>
  );
};

export default SellerController;
