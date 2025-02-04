import React, { useState } from 'react';
import image from '../../assets/images/image.png'
const EditProduct = ({card1}) => {
    const [packageWeight, setPackageWeight] = useState("2");
    const [productName, setProductName] = useState("");
    const [file, setFile] = useState(null);
  const [unit, setUnit] = useState("kg");
  const [warranty, setWarranty] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [reelName, setReelName] = useState("");
    const [videoName, setVideoName] = useState("The Ultimate Celebration Box");
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
    const handleReelFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "No file chosen");
      };
      const handleProductFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
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
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">Product Information:</div>
            <div className="p-2 bg-[#ffc600] rounded flex items-center">
              <div className="w-3 h-3 relative overflow-hidden"></div>
              <div className="text-center text-black text-[10px] font-semibold font-['Montserrat'] leading-none">Pending</div>
            </div>
          </div>
          <div className="border-2 border-[#d9d9d9]"></div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-2">
      <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase tracking-widest">
          Product Name
        </label>
        <input
          type="text"
          className="h-14 px-3 bg-white rounded border border-[#e0e4f4] flex items-center text-black text-sm font-medium font-['Montserrat'] leading-tight"
          placeholder="Enter Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      
      <div className="bg-white border border-[#e0e4f4] rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            className="w-[100px] h-[118px] border border-[#ecf0ff] rounded"
            src={image}
            alt="Preview"
          />
          <div className="flex flex-col gap-2.5 flex-grow">
            <p className="text-black text-sm font-medium font-['Montserrat'] leading-tight">
              Min size: 480x480 px. Max video length: 60 sec. Max file size: 100MB. Supported format: mp4
            </p>

            <div className="flex items-center gap-3 p-2.5 bg-[#ebefff] rounded-lg">
              {/* Hidden File Input */}
              <input
                type="file"
                accept="video/mp4"
                className="hidden"
                id="file-upload"
                onChange={handleProductFileChange}
              />

              {/* Choose File Button */}
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="p-3 bg-[#024a63] rounded text-white text-sm font-medium font-['Montserrat']">
                  Choose File
                </div>
              </label>

              {/* Show File Name */}
              <span className="text-[#3b3b3b] text-base font-bold font-['Montserrat']">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


          {/* Additional Images Section */}
          <div className="flex flex-col gap-3 w-full">
      <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">
        Additional Images
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
        </div>

        {/* Video Upload Section */}
        <div className="  space-y-4">
      {/* Title */}
      <h2 className="text-black text-2xl font-bold">Video Upload</h2>
      <div className="border-2 border-[#d9d9d9]"></div>

      {/* Reel Name */}
      <div className="space-y-3">
        <h3 className="text-black text-[10px] font-bold uppercase tracking-widest">Reel Name</h3>
        <input
          type="text"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs w-full focus:outline-none"
        />
      </div>

     
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
            <div className="p-2.5 bg-[#ebefff] rounded flex items-center gap-3">
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

        {/* Reels Upload Section */}
        <div className="flex flex-col gap-3 ">
      {/* Heading */}
      <div className="flex items-center">
        <span className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">Reels Upload</span>
        <span className="text-[#949494] text-2xl font-bold font-['Montserrat'] leading-loose ml-2">(Optional)</span>
      </div>
      <div className="border-2 border-[#d9d9d9]"></div>

      {/* Reel Name */}
      <div className="flex flex-col gap-3">
        <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
          Reel Name
        </label>
        <input
          type="text"
          value={reelName}
          onChange={(e) => setReelName(e.target.value)}
          placeholder="Enter reel name..."
          className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs font-normal font-['Montserrat'] leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Upload Section */}
      <div className="h-auto p-5 bg-white rounded-[5px] border border-[#e0e4f4] flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <img className="w-[73.10px] h-[118px] border border-[#e0e4f4]" src={image} alt="Reel" />
          <div className="flex flex-col gap-2.5">
            <p className="text-black text-sm font-medium font-['Montserrat'] leading-tight">
              Min size: 480x480 px. Max video length: 30 seconds. Max file size: 100MB. Supported Format: MP4
            </p>

            {/* File Upload Button */}
            <div className="p-2.5 bg-[#ebefff] rounded-[5px] flex items-center gap-3">
              <label htmlFor="file-upload" className="p-4 bg-[#024a63] text-white text-sm font-medium font-['Montserrat'] rounded cursor-pointer">
                Choose File
              </label>
              <input type="file" id="file-upload" accept="video/mp4" onChange={handleReelFileChange} className="hidden" />
              <span className="text-[#3b3b3b] text-base font-bold font-['Montserrat'] leading-normal">{fileName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Shipping & Warranty Section */}
        <div className="flex flex-col gap-3">
      {/* Heading */}
      <div className="text-black text-2xl font-bold font-['Montserrat'] leading-loose">Shipping & Warranty</div>
      <div className="border-2 border-[#d9d9d9]"></div>

      {/* Form Fields */}
      <div className="flex flex-wrap gap-3">
        {/* Package Weight */}
        <div className="flex flex-col gap-3 flex-1 min-w-[150px]">
          <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
            Package Weight
          </label>
          <input
            type="number"
            value={packageWeight}
            onChange={(e) => setPackageWeight(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Select Gram / KG */}
        <div className="flex flex-col gap-3 w-[150px]">
          <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
            Select Gram / KG
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="gram">Gram</option>
            <option value="kg">KG</option>
          </select>
        </div>

        {/* Warranty Type */}
        <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
          <label className="text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">
            Warranty Type
          </label>
          <select
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
            className="h-14 px-3 bg-white rounded border border-[#e0e4f4] text-black text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Warranty</option>
            <option value="no-warranty">No Warranty</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
            <option value="2-years">2 Years</option>
          </select>
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

export default EditProduct;