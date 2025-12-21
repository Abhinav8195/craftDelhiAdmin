import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import MobileChat from "./MobileChat";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isImageOpen, setIsImageOpen] = useState(false); // State for image modal visibility
  const [imageSrc, setImageSrc] = useState(""); 
  

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  const customers = [
    { name: "Rajesh", status: "Online" },
    { name: "Priya", status: "Offline" },
    { name: "Amit", status: "Online" },
    { name: "Neha", status: "Offline" },
    { name: "Suresh", status: "Online" },
    { name: "Pooja", status: "Online" },
    { name: "Vikram", status: "Offline" },
    { name: "Divya", status: "Online" },
    { name: "Karan", status: "Online" },
    { name: "Simran", status: "Offline" },
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && attachedFiles.length === 0) return;

    const newMsg = {
      text: newMessage,
      files: attachedFiles,
      sender: "me", 
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setAttachedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, idx) => idx !== index));
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission on Enter
      handleSendMessage();
    }
  };

  // Open image in full screen (60% width)
  const handleImageClick = (file) => {
    if (file.type.startsWith("image/")) {
      setImageSrc(URL.createObjectURL(file));
      setIsImageOpen(true);
    }
  };

  const handleCloseImage = () => {
    setIsImageOpen(false);
    setImageSrc("");
  };

  return (
    <div className="flex justify-center items-start">
      {
        isMobile ?  <MobileChat customers={customers}/>:
        <div className="w-full max-w-8xl bg-white flex rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[80vh]">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Chats</h2>
            {selectedCustomer && (
              <div className="flex items-center gap-3 p-3 mt-3 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">{selectedCustomer.name}</h3>
                  <p className={`text-xs ${selectedCustomer.status === "Online" ? "text-green-600" : "text-gray-400"}`}>
                    {selectedCustomer.status}
                  </p>
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Search Customer Name"
              className="mt-3 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredCustomers.map((customer, index) => (
              <div
                key={index}
                onClick={() => setSelectedCustomer(customer)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className={`text-xs ${customer.status === "Online" ? "text-green-600" : "text-gray-400"}`}>
                    {customer.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="w-2/3 flex flex-col">
          {/* Header */}
          <div className="h-16 p-4 bg-[#ecf0ff] flex items-center justify-between rounded-tl-2xl border-b border-gray-200">
            {selectedCustomer ? (
             <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">{selectedCustomer.name}</h3>
                  <p className={`text-xs ${selectedCustomer.status === "Online" ? "text-green-600" : "text-gray-400"}`}>
                    {selectedCustomer.status}
                  </p>
                </div>
                
              </div>


              
           
           
           
             </>
            ) : (
              <h3 className="text-gray-500">Select a user to start chatting</h3>
            )}
          </div>


          {selectedCustomer &&   <div className="h-12 p-1 bg-[#ecf0ff] rounded flex w-full">
        <button
          onClick={() => setActiveTab("chat")}
          className={`w-1/2 px-2 py-1 rounded-sm text-center text-xs font-medium ${
            activeTab === "chat" ? "bg-[#ee6f69] text-white" : "text-black"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("orderChat")}
          className={`w-1/2 px-2 py-1 rounded-sm text-center text-xs font-medium ${
            activeTab === "orderChat" ? "bg-[#ee6f69] text-white" : "text-black"
          }`}
        >
          Order Chat
        </button>
      </div>}
             

          {/* Chat Messages (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "me" ? "justify-end" : "items-start gap-2"}`}
              >
                {msg.sender !== "me" && <div className="w-8 h-8 bg-gray-300 rounded-full"></div>}
                <div className={`${msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-100"} p-3 rounded-lg max-w-xs`}>
                  <p className="text-sm">{msg.text}</p>
                  {/* Files */}
                  {msg.files?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.files.map((file, fidx) => (
                        <div key={fidx} className="bg-white border rounded p-2 text-xs">
                          {file.type.startsWith("image/") && (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="h-24 object-cover rounded cursor-pointer"
                              onClick={() => handleImageClick(file)} // Click to open image
                            />
                          )}
                          {file.type.startsWith("video/") && (
                            <video src={URL.createObjectURL(file)} controls className="h-24 rounded" />
                          )}
                          {file.type === "application/pdf" && (
                            <div>
                              <p className="text-gray-600">PDF Preview:</p>
                              <embed
                                src={URL.createObjectURL(file)}
                                type="application/pdf"
                                width="100%"
                                height="200px"
                                className="border rounded"
                              />
                            </div>
                          )}
                          {file.type.startsWith("application/") && !file.type.includes("pdf") && (
                            <div className="flex justify-between items-center">
                              <p className="text-gray-600">{file.name}</p>
                              <a
                                href={URL.createObjectURL(file)}
                                download={file.name}
                                className="text-blue-500 text-xs"
                              >
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
            {/* Previews */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                    {file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    )}
                    {file.type.startsWith("video/") && (
                      <video src={URL.createObjectURL(file)} className="object-cover w-full h-full" />
                    )}
                    {file.type.startsWith("application/") && (
                      <div className="flex items-center justify-center w-full h-full text-xs">
                        {file.name}
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input + Send Area */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiPaperclip size={20} />
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <input
                type="text"
                placeholder="Type a new message here"
                className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Listen for Enter key
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
        }

{isImageOpen && (
  <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="relative">
      <button
        onClick={handleCloseImage}
        className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
      >
        <FiX size={24} />
      </button>
      <img
        src={imageSrc}
        alt="Preview"
        className="max-w-[60vw] max-h-[60vh] object-cover rounded"
      />
    </div>
  </div>
)}


    
     
    </div>
  );
};

export default Chat;
