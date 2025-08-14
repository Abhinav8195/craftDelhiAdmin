import React, { useState } from "react";
import SellerEditProfile from "./SellerEditProfile";
import BuyerEditProfile from "../buyerManagement/BuyerEditProfile";
import SellerStoreinfo from "./SellerStoreinfo";
import SellerBank from "./SellerBank";

const SellerController = ({ seller, card1 }) => {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const tabs = ["Basic Information", "Store Information", "Bank Details"];

  return (
    <div className="flex justify-center items-start bg-white py-5">
      <div className="w-full max-w-[980px] p-5 bg-white rounded-xl shadow-lg">
        {/* Tab Navigation */}
        <div className="h-12 p-1 bg-[#ecf0ff] rounded flex">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`grow px-2 py-1 rounded-sm flex justify-center items-center cursor-pointer transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#ee6f69] text-white font-medium"
                  : "text-black font-normal"
              }`}
            >
              <div className="text-xs font-['Montserrat'] leading-none">
                {tab}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 min-h-[500px] transition-all duration-300">
          {activeTab === "Basic Information" && (
            <SellerEditProfile card1={card1} seller={seller} />
          )}
          {activeTab === "Store Information" && (
            <SellerStoreinfo card1={card1} seller={seller} />
          )}
          {activeTab === "Bank Details" && (
            <SellerBank card1={card1} seller={seller} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerController;
