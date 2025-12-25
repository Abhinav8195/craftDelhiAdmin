import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

const MobileChat = ({
  rooms,
  loadingRooms,
  messages,
  typingUser,
  selectedCustomer,
  setSelectedCustomer,
  handleRoomSelect,
  newMessage,
  setNewMessage,
  emitTyping,
  Admin_Id,

  // attachment props from Chat.jsx
  attachment,
  setAttachment,
  attachmentPreview,
  setAttachmentPreview,
  attachmentName,
  setAttachmentName,

  sendWithAttachment,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  const filteredRooms = rooms.filter((room) =>
    (room?.participants?.find(
      (p) => String(p.userId) !== String(Admin_Id)
    )?.name || "User")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getInitials = (name = "U") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateGroup = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";

    const y = new Date();
    y.setDate(today.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return "Yesterday";

    return d.toLocaleDateString();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
   <div
  className={`bg-white ${
    selectedCustomer
      ? "fixed inset-0 w-full h-screen flex flex-col z-50"
      : "w-full min-h-screen"
  }`}
>


      {/* ================= LIST SCREEN ================= */}
      {!selectedCustomer && (
        <div className="p-4 space-y-4">

          <h2 className="text-xl font-bold text-center">Messages</h2>

          <div className="flex items-center gap-2 px-3 h-10 border rounded-full shadow-sm">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            <input
              className="flex-1 text-sm outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loadingRooms ? (
            <p className="text-center text-gray-400">Loading chats…</p>
          ) : filteredRooms.length === 0 ? (
            <p className="text-center text-gray-400">No chats found</p>
          ) : (
            filteredRooms.map((room) => {
              const other = room.participants?.find(
                (p) => String(p.userId) !== String(Admin_Id)
              );

              return (
                <div
                  key={room._id}
                  className="flex gap-3 items-center p-3 rounded-xl border cursor-pointer hover:bg-gray-100 active:scale-[.99] transition"
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                    {getInitials(other?.name || "U")}
                  </div>

                  <div>
                    <p className="font-medium text-sm">{other?.name || "User"}</p>
                    <p className="text-[11px] text-gray-500">
                      {room?.title || "Chat"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================= CHAT SCREEN ================= */}
      {selectedCustomer && (
  <div className="flex flex-col h-full">

          {/* header */}
          <div className="flex items-center gap-3 p-4 border-b sticky top-0 bg-white">
            <ArrowLeftIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSelectedCustomer(null)}
            />

            <div className="flex flex-col">
              <span className="font-semibold">
                {selectedCustomer?.name || "User"}
              </span>

            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">

            {(() => {
              let lastDate = null;

              return messages.map((msg, idx) => {
                const isMe = String(msg.senderId) === String(Admin_Id);
                const msgDate = new Date(msg.createdAt).toDateString();
                const showDate = msgDate !== lastDate;
                lastDate = msgDate;

                return (
                  <React.Fragment key={idx}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 my-2">
                        {formatDateGroup(msg.createdAt)}
                      </div>
                    )}

                    <div className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                          {getInitials(selectedCustomer?.name)}
                        </div>
                      )}

                      <div
                        className={`max-w-[72%] px-3 py-2 rounded-2xl shadow 
                        ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white rounded-bl-none"}`}
                      >
                        {msg.filePreview && (
                          <img
                            src={msg.filePreview}
                            className="w-40 h-40 rounded-lg object-cover mb-2"
                          />
                        )}

                        {msg.fileName && !msg.filePreview && (
                          <div className="text-sm mb-1">📄 {msg.fileName}</div>
                        )}

                        {msg.message && <p className="text-sm">{msg.message}</p>}

                        <div className="text-[10px] opacity-60 text-right">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>

                      {isMe && (
                        <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                          {getInitials(localStorage.getItem("craftdelhiseller_name") || "S")}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              });
            })()}

            {typingUser && (
                    <div className="text-sm italic text-gray-400 px-10">
                      typing...
                    </div>
                  )}

            <div ref={messagesEndRef} />
          </div>

          {/* attachment preview */}
          {(attachment || attachmentPreview) && (
            <div className="mx-3 mb-1 p-3 bg-white border rounded-xl flex gap-3 items-center">
              {attachmentPreview ? (
                <img src={attachmentPreview} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <span>📄 {attachmentName}</span>
              )}

              <button
                className="ml-auto text-red-500"
                onClick={() => {
                  setAttachment(null);
                  setAttachmentPreview(null);
                  setAttachmentName("");
                }}
              >
                Remove ✕
              </button>
            </div>
          )}

          {/* input */}
          <div className="p-3 border-t bg-white flex gap-2 items-center">

            <input
              id="mobile-file-upload"
              type="file"
              className="hidden"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setAttachment(file);
                setAttachmentName(file.name);

                if (file.type.startsWith("image/")) {
                  setAttachmentPreview(URL.createObjectURL(file));
                } else {
                  setAttachmentPreview(null);
                }
              }}
            />

            <PaperClipIcon
              className="w-6 h-6 text-gray-600"
              onClick={() => document.getElementById("mobile-file-upload").click()}
            />

            <input
              className="flex-1 border rounded-full px-4 py-2 outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                emitTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && sendWithAttachment()}
            />

            <button
              onClick={sendWithAttachment}
              className="px-4 py-2 rounded-full bg-blue-600 text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileChat;
