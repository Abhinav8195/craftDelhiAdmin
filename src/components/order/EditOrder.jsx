import React, { useState } from 'react';
import image from '../../assets/images/image.png'
import { IoIosChatbubbles } from "react-icons/io";

const EditOrder = ({card1}) => {
   
    const [file, setFile] = useState(null);
 
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState(
        "I would like this order delivered on my friend’s anniversary. Could you ensure it arrives on the 25th in the morning? It’s a delicate item, so please handle it with extra care. Also, please include a small note that says, ‘Happy Anniversary, wishing you both endless love and joy!’ It would mean a lot if it’s packaged beautifully. Thank you for your attention to detail!"
      );
      const [fileName, setFileName] = useState("No file chosen");
      
      const [price, setPrice] = useState("2000");
      const [category, setCategory] = useState("Hand Made Craft");
      const [quantity, setQuantity] = useState("");
      const [dimensions, setDimensions] = useState("20 x 15 x 10 cm");
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
      }
    };
    const [images, setImages] = useState([null, null, null, null]); // 4 image slots

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-white ">
      <div className="w-full max-w-[980px] bg-white rounded-xl shadow-lg p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2.5  bg-white rounded-md ">
  {/* Order Information Header */}
  <div className="flex flex-col md:flex-row justify-between items-center gap-2">
    <h2 className="text-black text-2xl font-bold font-['Montserrat']">Order Information:</h2>

    {/* Buttons for Chat */}
    <div className="flex gap-2 flex-wrap">
  {/* Chat With Seller Button */}
  <button className="flex items-center gap-2 p-2 bg-[#024a63] rounded border border-white text-white text-[10px] font-semibold">
    <IoIosChatbubbles className="text-white text-lg" />
    Chat With Seller
  </button>

  {/* See Chats Button */}
  <button className="p-2 bg-[#024a63] rounded flex items-center text-white text-[10px] font-semibold">
    See Chats
  </button>
</div>

  </div>

  {/* Divider */}
  <div className="border-2 border-[#d9d9d9]"></div>
</div>



        <div className=" bg-white rounded-lg">
  <div className="grid md:grid-cols-3 gap-3">
    {/* Order ID */}
    <div className="flex flex-col gap-1">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Order ID</label>
      <input
        type="text"
        className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        placeholder="Enter Order ID"
      />
    </div>

    {/* Product ID */}
    <div className="flex flex-col gap-1">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Product ID</label>
      <input
        type="text"
        className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        placeholder="Enter Product ID"
      />
    </div>

    {/* Payment Status */}
    <div className="flex flex-col gap-1">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Payment Status</label>
      <select className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black">
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>
  </div>

  {/* Product Name */}
  <div className="mt-3">
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">Product Name</label>
    <input
      type="text"
      className="w-full h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
      placeholder="Enter Product Name"
    />
  </div>

  <div className="grid md:grid-cols-2 gap-3 mt-3">
    {/* Date */}
    <div className="flex flex-col gap-1">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Date</label>
      <input
        type="date"
        className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
      />
    </div>

    {/* Quantity */}
    <div className="flex flex-col gap-1">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">QTY</label>
      <input
        type="number"
        className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        placeholder="Enter Quantity"
      />
    </div>
  </div>
</div>


        <div className="space-y-4">
      <h2 className="text-black text-2xl font-bold">Product Details</h2>
      <div className="border-2 border-[#d9d9d9]"></div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Description</h3>
        <div className="p-3 bg-white rounded border border-[#d9d9d9]">
          <textarea
            className="w-full h-28 p-2 text-black text-xs border-none focus:outline-none resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
          />
          <div className="text-right text-black text-[10px] font-bold uppercase tracking-widest">
            {description.length}/300
          </div>
        </div>
      </div>

      {/* Price & Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">PRICE (Rs)</h3>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Categories (for Filtering)</h3>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Quantity & Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Quantity in Stock</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">
            Product Dimension <span className="text-[#ee6f69]">(Length, Width, Height)</span> Optional
          </h3>
          <input
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
          />
        </div>
      </div>
    </div>
    
        {/* Product Details Section */}
        <div className="flex flex-col gap-5">

          <div className="flex flex-col gap-3 w-full">
      <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">
        Additional Images:
      </div>

{/* video */}
<div className="  space-y-4">
     
      <div className="p-5 bg-white rounded border border-[#e0e4f4] space-y-5">
        <div className="flex flex-wrap items-center gap-5">
          <img
            className="w-[100px] h-[118px] border border-[#ecf0ff] object-cover"
            src={selectedFile ? URL.createObjectURL(selectedFile) : image}
            alt="Video Preview"
          />

         
          <div className="flex flex-col gap-2.5">
            <p className="text-black text-sm font-medium">
              Min size: 480x480 px. Max video length: 60 seconds. Max file size: 100MB. Supported Format: MP4.
            </p>

            {/* Upload Button */}
            <div class="h-[68px] p-2.5 bg-[#ebefff] rounded-[5px] justify-start items-center gap-[30px] inline-flex">
              <label className="p-4 bg-[#024a63] rounded cursor-pointer text-white text-sm font-medium">
                Choose File
                <input type="file" accept="video/mp4" className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-[#3b3b3b] text-base font-bold">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {images.map((imagee, index) => (
          <div
            key={index}
            className="h-[158px] p-5 bg-white rounded-[5px] border border-[#e0e4f4] flex flex-col justify-start items-start gap-5"
          >
            <div className="flex justify-start items-center gap-5 w-full">
              <img
                className="w-[100px] h-[118px] border border-[#ecf0ff] object-cover"
                src={imagee || image}
                alt={`Preview ${index + 1}`}
              />
              <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                <div className="p-2.5 bg-[#ebefff] rounded-[5px] flex justify-start items-center gap-[30px] w-full">
                  <label className="p-4 bg-[#024a63] text-white text-sm font-medium rounded flex justify-center items-center cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                  </label>
                  <div className="text-[#3b3b3b] text-xs font-bold font-['Montserrat'] leading-normal">
                    {imagee ? "Image Selected" : "Choose File"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>

     
        <div className=" bg-white rounded-lg ">
  {/* Header */}
  <h2 className="text-black text-2xl font-bold font-['Montserrat']">Delivery Information:</h2>

  {/* Divider */}
  <div className="border-2 border-[#d9d9d9] my-2"></div>

  {/* Delivery Address */}
  <div className="flex flex-col gap-2">
    <label className="text-black text-[10px] font-bold uppercase tracking-widest">Delivery Address</label>
    <div className="p-4 bg-white rounded border border-[#d9d9d9]">
      <p className="text-black text-xs font-normal">House no 766, Isra Village, Hyderabad, Pakistan</p>
      <p className="text-right text-black text-[10px] font-bold uppercase">9/300</p>
    </div>
  </div>

  {/* Address Details */}
  <div className="grid md:grid-cols-3 gap-3 mt-3">
    {/* State */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">State</label>
      <select className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black">
        <option value="">Select State</option>
        <option value="sindh">Sindh</option>
        <option value="punjab">Punjab</option>
        <option value="balochistan">Balochistan</option>
      </select>
    </div>

    {/* Colony / Locality */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Colony / Locality</label>
      <input
        type="text"
        className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        placeholder="Enter Colony / Locality"
      />
    </div>

    {/* Area */}
    <div className="flex flex-col">
      <label className="text-black text-[10px] font-bold uppercase tracking-widest">Area</label>
      <input
        type="text"
        className="h-12 px-3 bg-white rounded border border-[#e0e4f4] text-xs text-black"
        placeholder="Enter Area"
      />
    </div>
  </div>
</div>

       

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
  <button onClick={()=>card1(null)} className="px-4 py-2 bg-[#bbbbbb] rounded text-[#151618] text-sm font-medium font-['Montserrat'] leading-none">
    Cancel
  </button>
  <button className="h-12 px-4 py-2 bg-[#024a63] rounded text-white text-sm font-medium font-['Montserrat'] leading-none">
    Add
  </button>
</div>

      </div>
    </div>
  );
};

export default EditOrder;