import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
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

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);

  const [isMobile] = useState(window.innerWidth <= 768);

  /* ================= FETCH ROOMS ================= */

  useEffect(() => {
    const fetchRooms = async () => {
      const TOKEN = getAdminToken();
      if (!TOKEN || !Admin_Id) return;

      try {
        const res = await axios.get(`${API_BASE}/rooms/${Admin_Id}`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setRooms(res.data?.data || []);
        console.log(res.data?.data || [])
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

    // ✅ RECEIVE MESSAGE (replace optimistic)
    socketRef.current.on("message_received", (data) => {
      setMessages((prev) => {
        const exists = prev.find(
          (m) =>
            m.senderId === data.senderId &&
            m.message === data.message
        );

        if (exists) {
          return prev.map((m) =>
            m.senderId === data.senderId && m.message === data.message
              ? data
              : m
          );
        }

        return [...prev, data];
      });
    });

    // ✅ TYPING INDICATOR
    socketRef.current.on("user_typing", ({ userId, isTyping }) => {
      if (String(userId) === String(Admin_Id)) return;
      setTypingUser(isTyping);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  /* ================= AUTOSCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= ROOM SELECT ================= */

  const handleRoomSelect = async (room) => {
    const other = room.participants?.find(
      (p) => String(p.userId) !== String(Admin_Id)
    );

    setSelectedCustomer(other || {});
    setRoomId(room._id);
    setMessages([]);
    setTypingUser(false);

    const TOKEN = getAdminToken();

    try {
      socketRef.current.emit("join_room", { roomId: room._id });

      const res = await axios.get(
        `${API_BASE}/messages?roomId=${room._id}&page=1&limit=50`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const list = res.data?.data || res.data || [];

      // ✅ SORT messages (old → new)
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setMessages(sorted);
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

    // ✅ OPTIMISTIC UI
    setMessages((prev) => [
      ...prev,
      {
        message: messageText,
        senderId: Admin_Id,
      },
    ]);

    setNewMessage("");

    // ✅ ALWAYS SAVE IN DB
    await sendMessageViaREST(roomId, messageText);

    // ✅ SOCKET FOR REALTIME
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", {
        roomId,
        message: messageText,
      });
    }
  };

  const sendMessageViaREST = async (roomId, message) => {
    const TOKEN = getAdminToken();
    if (!TOKEN) return;

    try {
      await axios.post(
        `${API_BASE}/message`,
        { roomId, message },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
    } catch (err) {
      console.error("❌ REST send failed", err);
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

  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  /* ================= UI ================= */

  return (
    <div className="flex justify-center h-screen p-4 bg-gray-50">
      {isMobile ? (
        <MobileChat customers={rooms} />
      ) : (
        <div className="w-full max-w-6xl bg-white flex rounded-2xl shadow-lg border h-[85vh] overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r bg-gray-50">
            <div className="p-4 border-b bg-white">
              <h2 className="text-xl font-bold">Messages</h2>
              <input
                className="mt-3 w-full p-2 border rounded-lg"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="p-2 overflow-y-auto h-[calc(100%-120px)]">
              {loadingRooms ? (
                <p className="text-center p-4 text-gray-400">Loading chats...</p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => handleRoomSelect(room)}
                    className={`flex gap-3 p-3 rounded-xl cursor-pointer mb-1 ${
                      roomId === room._id
                        ? "bg-blue-100"
                        : "hover:bg-white"
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      C
                    </div>
                    <div>
                      <h3 className="font-semibold">Chat</h3>
                      <p className="text-xs text-gray-500">
                        Click to view messages
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col">
            {selectedCustomer ? (
              <>
                <div className="p-4 border-b font-bold">
                  {selectedCustomer?.name || "User"}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#f0f2f5] space-y-4">
                  {messages.map((msg, idx) => {
                    const isMe =
                      String(msg.senderId) === String(Admin_Id);
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        } gap-2`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
                            {getInitial(selectedCustomer?.name)}
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            isMe
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="text-[10px] block text-right opacity-70">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {typingUser && (
                    <div className="text-sm italic text-gray-400 px-10">
                      typing...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t flex gap-2 bg-white">
                  <input
                    className="flex-1 border rounded-full px-4 py-2"
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
                    className="bg-blue-600 text-white p-3 rounded-full"
                  >
                    <FiSend />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a chat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
