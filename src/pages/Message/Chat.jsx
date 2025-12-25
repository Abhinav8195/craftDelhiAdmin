import React, { useState, useRef, useEffect } from "react";
import { FiPaperclip,FiSend } from "react-icons/fi";
import MobileChat from "./MobileChat";
import { io } from "socket.io-client";
import axios from "axios";
import { getAdminToken } from "../../utils/auth";

/* ================= CONFIG ================= */

const API_BASE = "https://backend.craftdelhi.com/chat";
const Admin_Id = "23";

/* ================= COMPONENT ================= */

const Chat = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const [messagesByRoom, setMessagesByRoom] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const [typingUser, setTypingUser] = useState({});

  const [isMobile] = useState(window.innerWidth <= 768);

  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");

  /* ================= FETCH ROOMS ================= */

  useEffect(() => {
    const fetchRooms = async () => {
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
    };

    fetchRooms();
  }, []);

  /* ================= SOCKET INIT ================= */

  useEffect(() => {
    const TOKEN = getAdminToken();
    if (!TOKEN) return;

    socketRef.current = io("https://backend.craftdelhi.com", {
      path: "/chat/socket.io",
      auth: { token: TOKEN },
      transports: ["polling", "websocket"],
      withCredentials: true,
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
});


    socketRef.current.on("user_typing", ({ userId, isTyping }) => {
      if (String(userId) === String(Admin_Id)) return;
      setTypingUser(isTyping);
    });

    return () => socketRef.current?.disconnect();
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
    if (!newMessage.trim() || !roomId) return;

    const messageText = newMessage;

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
      },
    ],
  };
});

    setNewMessage("");

    const TOKEN = getAdminToken();

    try {
      await axios.post(
        `${API_BASE}/message`,
        { roomId, message: messageText },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
    } catch (err) {
      console.error("❌ REST send failed", err);
    }

    socketRef.current.emit("send_message", {
      roomId,
      message: messageText,
    });
  };

   /* ================= SEND MESSAGE (TEXT ONLY BACKEND) ================= */

  const sendTextOnly = async (text) => {
    if (!text || !roomId) return;

    const TOKEN = getAdminToken();

    try {
      await axios.post(
        `${API_BASE}/message`,
        { roomId, message: text },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
    } catch (err) {
      console.error("❌ REST send failed", err);
    }

    socketRef.current.emit("send_message", {
      roomId,
      message: text,
    });
  };

const sendWithAttachment = async () => {
    if (!roomId) return;

    if (!newMessage.trim() && !attachment) return;

    // add optimistically in UI
     setMessagesByRoom(prev => {
  const roomMessages = prev[roomId] || [];

  return {
    ...prev,
    [roomId]: [
      ...roomMessages,
      {
        senderId: Admin_Id,
        message: newMessage,
        fileName: attachmentName,
        filePreview: attachmentPreview,
        createdAt: new Date(),
      },
    ],
  };
});

    // send text to backend (file upload can be added later)
    if (newMessage.trim()) {
      await sendTextOnly(newMessage.trim());
    }

    // clear states
    setNewMessage("");
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentName("");
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
    <div className="flex justify-center h-full overflow-hidden">
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
  attachmentName={attachmentName}
  setAttachmentName={setAttachmentName}
  sendWithAttachment={sendWithAttachment}
/>
      ) : (
        <div className="w-full max-w-6xl flex rounded-2xl border h-[80vh] overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r bg-white">
            <div className="p-4 border-b sticky top-0 z-10">
              <h2 className="text-xl font-bold">Messages</h2>

              <input
                  className="mt-3 w-full p-2 rounded-xl bg-gray-100
             border-none
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200
             outline-none"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

              <div className="p-2 pt-6 overflow-y-auto space-y-2">
  {loadingRooms ? (
    <p className="text-center p-4 text-gray-400">
      Loading chats...
    </p>
  ) : rooms.length === 0 ? (
    <p className="text-center p-4 text-gray-400">
      No chats found
    </p>
  ) : (
    filteredRooms.map((room) => {
      const otherUser = room?.participants?.find(
        (p) => String(p?.userId) !== String(Admin_Id)
      );

      return (
        <div
          key={room._id}
          onClick={() => handleRoomSelect(room)}
          className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all ${
            roomId === room._id
              ? "bg-blue-50 border border-blue-200"
              : "hover:bg-gray-100"
          }`}
        >
          {/* avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center font-semibold shadow">
            {getInitial(otherUser?.name || "U")}
          </div>

          {/* name + context */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">
              {otherUser?.name || "User"}
            </h3>

            <p className="text-[11px] text-gray-500">
              {room?.title || "Chat"}
            </p>
          </div>
        </div>
      );
    })
  )}
</div>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col">
            {!selectedCustomer ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a chat
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b bg-white sticky top-0 z-10 flex justify-between">
                  <span className="font-bold">{selectedCustomer?.name || "User"}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#f3f4f7] space-y-3">
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
                            <div className="text-center text-xs text-gray-500 my-3">
                              {formatDateGroup(msg.createdAt)}
                            </div>
                          )}

                          <div
                            className={`flex items-end gap-2 ${
                              isMe
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            {!isMe && (
                              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(
                                  selectedCustomer?.name
                                )}
                              </div>
                            )}

                            <div
                              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow
                                ${
                                  isMe
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none"
                                }`}
                            >
                              {/* IMAGE */}
                              {msg.filePreview && (
                                <img
                                  src={msg.filePreview}
                                  className="w-40 h-40 object-cover rounded mb-2"
                                  alt="attachment"
                                />
                              )}

                              {/* DOC */}
                              {msg.fileName && !msg.filePreview && (
                                <div className="text-sm mb-1">
                                  📄 {msg.fileName}
                                </div>
                              )}

                              {/* TEXT */}
                              {msg.message && <p>{msg.message}</p>}

                              <span className="text-[10px] block text-right opacity-60 mt-1">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>

                            {isMe && (
                              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                                R
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

                 {/* Input Bar */}
                <div className="p-4 border-t bg-white">
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
                    <div className="mb-3 p-3 rounded-xl border bg-white flex items-center gap-3">
                      {attachmentPreview && (
                        <img
                          src={attachmentPreview}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}

                      {!attachmentPreview && (
                        <div className="text-sm">📄 {attachmentName}</div>
                      )}

                      <button
                        className="ml-auto text-red-500"
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

                  <div className="flex gap-3 rounded-full px-3 py-2 shadow-sm items-center">
                    {/* clip icon */}
                    <button
                      onClick={() =>
                        document.getElementById("file-upload-desktop").click()
                      }
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      <FiPaperclip size={20} />
                    </button>

                    <input
                      className="flex-1 border rounded-full px-4 py-2 outline-none"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        emitTyping();
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && sendWithAttachment()
                      }
                      placeholder="Type a message..."
                    />

                    <button
                      onClick={sendWithAttachment}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                    >
                      <FiSend />
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
