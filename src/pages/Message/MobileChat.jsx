import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  PaperClipIcon,
  CameraIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const MobileChat = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); // for image preview
  const [viewImage, setViewImage] = useState(null);       // for viewing fullscreen
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [file, setFile] = useState(null);                 // for document (pdf/docx)
  const [fileName, setFileName] = useState('');            // store file name

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastMessageRef = useRef(null);  // Ref for the last message

  const handleSendMessage = () => {
    if (message.trim() || previewImage || file) {
      const newMessage = {
        text: message.trim(),
        image: previewImage,
        file: file,
        sender: 'me',
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      setPreviewImage(null);
      setFile(null);
      setFileName('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      setPreviewImage(URL.createObjectURL(file));
      setFile(null);
    } else if (
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setFile(URL.createObjectURL(file));
      setPreviewImage(null);
    } else {
      alert('Please select a valid image or document (PDF/Word)');
    }
  };

  const handleCameraClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleImageClick = (imageUrl) => {
    setViewImage(imageUrl);
    setIsImageOpen(true);
  };

  const closeImage = () => {
    setIsImageOpen(false);
    setViewImage(null);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Scroll to the last message whenever messages change

  return (
    <div className="w-full min-h-screen bg-white p-4">
      {!selectedCustomer ? (
        <>
          {/* Heading */}
          <h1 className="text-center text-2xl font-bold mb-4">My Chat</h1>

          {/* Search Bar */}
          <div className="flex items-center gap-2 w-full sm:w-[239px] px-3 h-10 bg-white border border-gray-300 rounded mb-4">
            <MagnifyingGlassIcon  className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black text-xs bg-transparent outline-none border-none focus:outline-none focus:ring-0"
            />
          </div>

          {/* Customer List */}
          <div className="flex flex-col gap-4">
            {filteredCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setSearchTerm('');
                }}
              >
                <img
                  src={customer.image}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm font-medium">{customer.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex items-center -ml-4 mb-4">
            <ArrowLeftIcon
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={() => setSelectedCustomer(null)}
            />
            <h1 className="text-center flex-1 text-lg">{selectedCustomer.name}</h1>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col gap-2 mb-20">
            {messages.map((msg, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null} // Assign ref to the last message
                className={`max-w-[70%] p-2 rounded-lg ${
                  msg.sender === 'me' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="preview"
                    className="w-40 h-40 object-cover rounded-md mb-2 cursor-pointer"
                    onClick={() => handleImageClick(msg.image)}
                  />
                )}
                {msg.file && (
                  <a href={msg.file} className="text-blue-600" download>
                    Download File
                  </a>
                )}
                {msg.text && <p className="text-sm">{msg.text}</p>}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="fixed bottom-4 left-0 right-0 px-4 flex items-center gap-2">
            {/* Attach Image */}
            <label htmlFor="file-upload">
              <PaperClipIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Camera Click */}
            <CameraIcon
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={handleCameraClick}
            />

            {/* Text Input */}
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />

            {/* Send Button */}
            <button onClick={handleSendMessage}>
              <PaperAirplaneIcon className="w-6 h-6 text-blue-500 rotate-90" />
            </button>
          </div>

          {/* Preview Selected Image or File */}
          {(previewImage || file) && (
            <div className="fixed bottom-20 left-4 right-4 bg-white p-4 border rounded-lg shadow-md flex items-center gap-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              {file && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 bg-gray-200 flex justify-center items-center rounded">
                    <span className="text-gray-700 text-2xl">📄</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {fileName || 'Document Selected'}
                  </div>
                </div>
              )}
              <XMarkIcon
                className="w-5 h-5 text-gray-500 ml-auto cursor-pointer"
                onClick={() => {
                  setPreviewImage(null);
                  setFile(null);
                  setFileName('');
                }}
              />
            </div>
          )}

          {/* Full-Screen View of Clicked Image */}
          {isImageOpen && viewImage && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center">
              <img
                src={viewImage}
                alt="Full-Screen"
                className="w-full h-auto max-w-full max-h-full object-contain"
                onClick={closeImage}
              />
              <XMarkIcon
                className="absolute top-4 right-4 w-8 h-8 text-white cursor-pointer"
                onClick={closeImage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MobileChat;
