import React, { useState } from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";

const AddPayment = ({ close }) => {
  // State for form fields
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [bank, setBank] = useState('State Bank of India');
  const [branchLocation, setBranchLocation] = useState('Connaught Place, New Delhi');
  const [accountHolderName, setAccountHolderName] = useState('Rahul Sharma');
  const [accountNumber, setAccountNumber] = useState('123456789012');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');

  // Function to handle form submission
  const handleAddPayment = ({close}) => {
    const paymentDetails = {
      orderId,
      paymentId,
      sellerName,
      totalPayment,
      bank,
      branchLocation,
      accountHolderName,
      accountNumber,
      ifscCode,
    };
    console.log('Payment Details:', paymentDetails);
   
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Modal content */}
      <div className="relative w-full max-w-[742px] h-auto p-5 bg-white rounded-xl shadow-[0px_4px_30px_0px_rgba(255,255,255,0.25)] border border-[#d9d9d9] flex-col justify-start items-start gap-[15px] inline-flex overflow-hidden z-10">
        <div className="self-stretch justify-start items-start gap-[15px] inline-flex">
          <div className="grow shrink basis-0 text-black text-2xl font-bold font-['Montserrat'] leading-loose">Add New Payment</div>
          <div className="w-8 h-8 relative overflow-hidden" onClick={close}>
            <button className="text-black text-lg"><IoMdCloseCircleOutline size={28} /></button>
          </div>
        </div>
        <div className="self-stretch h-[1px] border-2 border-[#d9d9d9]"></div>

        <div className="self-stretch h-auto flex-col justify-start items-start gap-[15px] flex">
          <div className="self-stretch justify-start items-start gap-[15px] inline-flex flex-wrap sm:flex-nowrap">
            <div className="grow shrink basis-0 h-[84px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Order ID</div>
              <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                  placeholder="Enter Order ID"
                />
              </div>
            </div>
            <div className="grow shrink basis-0 h-[84px] flex-col justify-start items-start gap-3 inline-flex">
              <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Payment ID</div>
              <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                  placeholder="Enter Payment ID"
                />
              </div>
            </div>
          </div>

          <div className="self-stretch justify-start items-start gap-[15px] inline-flex flex-wrap sm:flex-nowrap">
            <div className="grow shrink basis-0 h-[84px] flex-col justify-start items-start gap-3 inline-flex">
              <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Seller Name</div>
              <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                  placeholder="Enter Seller Name"
                />
              </div>
            </div>
            <div className="grow shrink basis-0 h-[84px] flex-col justify-start items-start gap-3 inline-flex">
              <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Total Payment</div>
                <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                <input
                  type="text"
                  value={totalPayment}
                  onChange={(e) => setTotalPayment(e.target.value)}
                  className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                  placeholder="Enter Total Payment"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch h-auto flex-col justify-start items-start gap-3 flex">
          <div className="self-stretch text-black text-2xl font-bold font-['Montserrat'] leading-loose">Bank Account Details</div>
          <div className="self-stretch h-[1px] border-2 border-[#d9d9d9]"></div>
          <div className="self-stretch h-auto flex-col justify-center items-start gap-3 flex">
            <div className="self-stretch justify-start items-start gap-3 inline-flex flex-wrap sm:flex-nowrap">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Select Bank</div>
                  <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                  >
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Branch Location</div>
                  <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                  <input
                    type="text"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                    placeholder="Enter Branch Location"
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-3 inline-flex flex-wrap sm:flex-nowrap">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch text-black border-none text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Account Holder Name</div>
                  <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                    placeholder="Enter Account Holder Name"
                  />
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Account Number</div>
                  <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                    placeholder="Enter Account Number"
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-3 inline-flex flex-wrap sm:flex-nowrap">
              <div className="w-full sm:w-[454px] flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch text-black  text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">IFSC Code</div>
                  <div className="self-stretch h-14 bg-white rounded border border-[#e0e4f4] flex items-center">
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full h-full text-black border-none text-xs font-normal font-['Montserrat'] leading-tight outline-none px-3"
                    placeholder="Enter IFSC Code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch justify-end items-end gap-2 inline-flex flex-wrap sm:flex-nowrap">
          <div className="p-4 bg-[#bbbbbb] rounded justify-center items-center gap-3 flex overflow-hidden cursor-pointer" onClick={close}>
            <div className="text-center text-[#151618] text-sm font-medium font-['Montserrat'] leading-none">Cancel</div>
          </div>
          <div className="p-4 bg-[#024a63] rounded justify-center items-center gap-3 flex overflow-hidden cursor-pointer" onClick={handleAddPayment}>
            <div className="text-center text-white text-sm font-medium font-['Montserrat'] leading-none">Add</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
