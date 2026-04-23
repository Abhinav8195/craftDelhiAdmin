import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiPaperclip,FiSend } from "react-icons/fi";
import MobileChat from "./MobileChat";
import { io } from "socket.io-client";
import axios from "axios";
import { getAdminToken } from "../../utils/auth";

/* ================= CONFIG ================= */

const API_BASE = process.env.REACT_APP_CHAT_API_BASE;
const Admin_Id = process.env.REACT_APP_ADMIN_ID;

/* ================= COMPONENT ================= */

const Chat = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const roomsRef = useRef([]);
  useEffect(() => { roomsRef.current = rooms; }, [rooms]);
  
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [totalUnseen, setTotalUnseen] = useState(0);
  const activeRoomRef = useRef(null);

  const [isMobile] = useState(window.innerWidth <= 768);

  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");

  /* ================= FETCH ROOMS ================= */
 
  const fetchRooms = useCallback(async () => {
    const TOKEN = getAdminToken();
    if (!TOKEN || !Admin_Id) return;
 
    try {
      const res = await axios.get(`${API_BASE}/rooms`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
 
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error("❌ Rooms fetch failed", err);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, []); 

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    activeRoomRef.current = roomId;
  }, [roomId]);

  /* ================= SOCKET INIT ================= */

  useEffect(() => {
    const TOKEN = getAdminToken();
    if (!TOKEN) return;

    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      path: "/chat/socket.io",
      auth: { token: TOKEN },
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socketRef.current.on("message_received", (data) => {
      if (!data?.roomId) return;
  
      // ignore my own already-added optimistic message
      if (String(data.senderId) === String(Admin_Id)) return;
  
      setMessagesByRoom(prev => {
        const roomMessages = prev[data.roomId] || [];
        return {
          ...prev,
          [data.roomId]: [...roomMessages, data],
        };
      });
  
      // If this room isn't in our current list, refresh rooms
      if (!roomsRef.current.find(r => r._id === data.roomId)) {
        fetchRooms();
      }

      // If we are already in this room, mark it as read immediately
      if (data.roomId === activeRoomRef.current) {
        if (socketRef.current) {
          socketRef.current.emit("mark_room_read", { roomId: data.roomId });
        }
      }
    });

    socketRef.current.on("unseen_count_updated", (data) => {
      console.log("📊 Admin Unseen updated:", data);
      const count = data.totalUnseen || 0;
      setTotalUnseen(count);
      
      // Sync with Sidebar Badge
      window.dispatchEvent(new CustomEvent('sync_unread_count', { detail: count }));

      setRooms(prev => prev.map(room => ({
        ...room,
        unreadCount: data.countsByRoom[room._id] || 0
      })));
    });

    socketRef.current.emit("get_unseen_count");


    socketRef.current.on("user_typing", ({ userId, isTyping, roomId: typingRoomId }) => {
      if (String(userId) === String(Admin_Id)) return;
      if (String(typingRoomId) !== String(activeRoomRef.current)) return;
      setTypingUser(isTyping);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  /* ================= AUTOSCROLL ================= */

   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByRoom, roomId]);

  /* ================= ROOM SELECT ================= */

  const handleRoomSelect = async (room) => {
    const other = room.participants?.find(
      (p) => String(p.userId) !== String(Admin_Id)
    );

    setSelectedCustomer(other || {});
    setRoomId(room._id);
    setTypingUser(false);

    const TOKEN = getAdminToken();

    try {
      socketRef.current.emit("join_room", { roomId: room._id });

      const res = await axios.get(
        `${API_BASE}/messages?roomId=${room._id}&page=1&limit=50`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const list = res.data?.data || [];

      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setMessagesByRoom(prev => ({
        ...prev,
        [room._id]: sorted
      }));

      // Local clear for snappy UI
      setRooms(prev => prev.map(r => r._id === room._id ? { ...r, unreadCount: 0 } : r));
      if (socketRef.current) {
        socketRef.current.emit("mark_room_read", { roomId: room._id });
      }
    } catch (err) {
      console.error("❌ Message load failed", err);
    }
  };

  /* ================= TYPING EMIT ================= */

  const emitTyping = () => {
    if (!roomId) return;

    socketRef.current.emit("typing", { roomId, isTyping: true });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing", { roomId, isTyping: false });
    }, 1500);
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async () => {
    if (!roomId) return;

    // Send text message if any
    if (newMessage.trim()) {
      const messageText = newMessage;
      const tempId = "admin-" + Date.now() + Math.random().toString(36).substring(7);
      
      setMessagesByRoom(prev => {
        const roomMessages = prev[roomId] || [];
        return {
          ...prev,
          [roomId]: [
            ...roomMessages,
            {
              message: messageText,
              senderId: Admin_Id,
              createdAt: new Date(),
              tempId,
            },
          ],
        };
      });

      setNewMessage("");

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("send_message", {
          roomId,
          message: messageText,
          tempId,
        });
      } else {
        const TOKEN = getAdminToken();
        try {
          await axios.post(
            `${API_BASE}/message`,
            { roomId, message: messageText, tempId },
            { headers: { Authorization: `Bearer ${TOKEN}` } }
          );
        } catch (err) {
          console.error("❌ REST send failed", err);
        }
      }
    }

    // Send attachment if any
    if (attachment) {
      await handleSendAttachment();
    }
  };

  /* ================= SEND ATTACHMENT ================= */

  const handleSendAttachment = async () => {
    if (!attachment || !roomId) return;

    const TOKEN = getAdminToken();
    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("file", attachment);

    // add optimistically in UI
    const fileNameStored = attachmentName;
    const filePrevStored = attachmentPreview;

    setMessagesByRoom(prev => {
      const roomMessages = prev[roomId] || [];
      return {
        ...prev,
        [roomId]: [
          ...roomMessages,
          {
            senderId: Admin_Id,
            fileName: fileNameStored,
            filePreview: filePrevStored,
            createdAt: new Date(),
          },
        ],
      };
    });

    // clear states
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentName("");

    try {
      const res = await axios.post(
        `${API_BASE}/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const serverMsg = res.data?.data || res.data || {};
      const persistentUrl = serverMsg.attachmentUrl || serverMsg.message || serverMsg.fileUrl || serverMsg.filePath;

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("send_message", {
          roomId,
          fileName: fileNameStored,
          filePreview: persistentUrl || filePrevStored,
          message: persistentUrl,
          attachmentType: serverMsg.attachmentType || (attachment.type.startsWith("image/") ? "image" : "file"),
        });
      }
    } catch (err) {
      console.error("❌ REST attachment send failed", err);
    }
  };






  /* ================= HELPERS ================= */

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const getInitial = (name = "U") => name.charAt(0).toUpperCase();

  const formatDateGroup = (date) => {
    const d = new Date(date);
    const today = new Date();

    const isToday = d.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString();
  };


  const isImageURL = (url) => {
    return (
      typeof url === "string" &&
      (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ||
        url.includes("chat_media"))
    );
  };

  const getInitials = (name = "U") => {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
};


const filteredRooms = rooms.filter((room) => {
  const other = room?.participants?.find(
    (p) => String(p?.userId) !== String(Admin_Id)
  );

  const name = other?.name || "";
  const title = room?.title || "";

  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );
});


  /* ================= UI ================= */

  return (
    <div className="flex justify-center h-full overflow-hidden bg-gray-50 ">
      <style>
        {`
          @keyframes fadeUpMsg {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .message-anim {
            animation: fadeUpMsg 0.25s ease-out forwards;
          }
          
          /* Custom scrollbar for minimum clutter */
          .scrollbar-hide::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-hide::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-hide::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 4px;
          }
          .scrollbar-hide:hover::-webkit-scrollbar-thumb {
            background: #d1d5db;
          }
        `}
      </style>

      {isMobile ? (
       <MobileChat
          rooms={rooms}
          loadingRooms={loadingRooms}
          messages={messagesByRoom[roomId] || []}
          typingUser={typingUser}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          handleRoomSelect={handleRoomSelect}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          emitTyping={emitTyping}
          Admin_Id={Admin_Id}
          attachment={attachment}
          setAttachment={setAttachment}
          attachmentPreview={attachmentPreview}
          setAttachmentPreview={setAttachmentPreview}
          setAttachmentName={setAttachmentName}
          sendWithAttachment={handleSendMessage}
        />
      ) : (
        <div className="w-full max-w-6xl flex rounded-2xl shadow-sm border border-gray-200 h-[80vh] bg-white overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r flex flex-col h-full bg-[#fcfcfc]">
            <div className="px-5 py-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Messages</h2>

              <div className="relative mt-5">
                <input
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-100 border border-transparent focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-sm text-gray-700 placeholder-gray-400"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
              {loadingRooms ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-gray-400 animate-pulse">Loading chats...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-gray-400">No conversations</p>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const otherUser = room?.participants?.find(
                    (p) => String(p?.userId) !== String(Admin_Id)
                  );

                  return (
                    <div
                      key={room._id}
                      onClick={() => handleRoomSelect(room)}
                      className={`flex gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 items-center ${
                        roomId === room._id
                          ? "bg-blue-50/60"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {getInitial(otherUser?.name || "U")}
                      </div>

                      {/* name + context */}
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex justify-between items-center w-full">
                             <h3 className="font-semibold text-gray-900 text-[14px] truncate">
                               {otherUser?.name || "User"}
                             </h3>
                             {room.unreadCount > 0 && (
                               <div className="bg-green-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-bold">
                                 {room.unreadCount}
                               </div>
                             )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate uppercase mt-0.5 tracking-wide">
                          {room?.contextType || "PRODUCT"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col h-full bg-[#f8f9fc]">
            {!selectedCustomer ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <FiSend className="text-gray-300 text-2xl" />
                </div>
                <p className="text-sm font-medium">Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0 flex items-center gap-4 z-10">
                   <div className="flex flex-col">
                      <span className="font-bold text-gray-900 tracking-tight">{selectedCustomer?.name || "User"}</span>
                   </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
                  {(() => {
                    let lastDate = null;
                    const messages = messagesByRoom[roomId] || [];

                    return messages.map((msg, idx) => {
                      const isMe =
                        String(msg.senderId) === String(Admin_Id);

                      const msgDate = new Date(
                        msg.createdAt
                      ).toDateString();

                      const showDate = msgDate !== lastDate;
                      lastDate = msgDate;

                      return (
                        <React.Fragment key={idx}>
                          {showDate && (
                            <div className="flex justify-center my-6">
                              <span className="text-gray-500 text-[11px] font-medium tracking-wide">
                                {formatDateGroup(msg.createdAt)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex items-start gap-2.5 message-anim w-full ${
                              isMe
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            {!isMe && (
                              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-sm mt-1">
                                {getInitials(selectedCustomer?.name)}
                              </div>
                            )}

                            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl shadow-sm break-words whitespace-pre-wrap text-[14px] leading-relaxed
                                  ${
                                    isMe
                                      ? "bg-blue-600 text-white rounded-tr-sm"
                                      : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                                  }`}
                              >
                                {/* IMAGE (Optimistic or S3 URL) */}
                                {(msg.filePreview || (msg.message && isImageURL(msg.message))) && (
                                  <img
                                    src={msg.filePreview || msg.message}
                                    className="w-48 h-48 object-cover rounded-xl mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                                    alt="attachment"
                                    onClick={() => window.open(msg.filePreview || msg.message, "_blank")}
                                  />
                                )}

                                {/* DOC (Optimistic or stored placeholder) */}
                                {msg.fileName && !msg.filePreview && !isImageURL(msg.message) && (
                                  <div className={`text-sm mb-1 flex items-center gap-2 ${isMe ? 'text-gray-100' : 'text-gray-500'}`}>
                                    <FiPaperclip /> {msg.fileName}
                                  </div>
                                )}

                                {/* TEXT (Hide if it's the image URL itself) */}
                                {msg.message && !isImageURL(msg.message) && <span>{msg.message}</span>}
                              </div>
                              <div className="text-[10px] mt-1 text-gray-400">
                                {formatTime(msg.createdAt)}
                              </div>
                            </div>
                            
                            {isMe && (
                              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-sm mt-1">
                                R
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    });
                  })()}

                  {typingUser && (
                    <div className="flex items-start gap-2.5 message-anim">
                       <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-sm mt-1">
                           {getInitials(selectedCustomer?.name)}
                       </div>
                       <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-1.5 h-10 w-16">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                       </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                 {/* Input Bar */}
                <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                  {/* Hidden file input */}
                  <input
                    id="file-upload-desktop"
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

                  {/* preview box */}
                  {(attachment || attachmentPreview) && (
                    <div className="mb-3 p-2 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3 animate-pulse">
                      {attachmentPreview && (
                        <img
                          src={attachmentPreview}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          alt="preview"
                        />
                      )}

                      {!attachmentPreview && (
                        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FiPaperclip /> {attachmentName}
                        </div>
                      )}

                      <button
                        className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-2"
                        onClick={() => {
                          setAttachment(null);
                          setAttachmentPreview(null);
                          setAttachmentName("");
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 items-center bg-white border border-gray-300 rounded-full p-1.5 pr-1.5 focus-within:border-gray-400 transition-all shadow-sm">
                    {/* clip icon */}
                    <button
                      onClick={() =>
                        document.getElementById("file-upload-desktop").click()
                      }
                      className="text-gray-400 hover:text-gray-700 p-2.5 rounded-full transition-all flex-shrink-0"
                    >
                      <FiPaperclip size={18} />
                    </button>

                    <input
                      className="flex-1 bg-transparent px-2 py-2 outline-none text-[15px] text-gray-800 placeholder-gray-400 border-none focus:outline-none focus:border-none focus:ring-0"
                      value={newMessage}
                      onChange={(e) => {
                         setNewMessage(e.target.value);
                         emitTyping();
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type a message..."
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !attachment}
                      className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-full shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex-shrink-0"
                    >
                      <FiSend size={18} className="translate-y-[1px] -translate-x-[1px]" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
