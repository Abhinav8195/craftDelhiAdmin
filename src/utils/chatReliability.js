export const CHAT_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const CHAT_UPLOAD_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "application/pdf",
]);

export const validateChatAttachment = (file) => {
  if (!file) return "Please choose a file.";
  if (!CHAT_UPLOAD_TYPES.has(file.type)) return "Use a JPG, PNG, WEBP, GIF, MP4, WEBM or PDF file.";
  if (file.size > CHAT_UPLOAD_MAX_BYTES) return "Attachments must be 10 MB or smaller.";
  return "";
};

export const messageIdentity = (message = {}) => String(message._id || message.id || message.tempId || "");
export const compareChatMessages = (left = {}, right = {}) => {
  const delta = new Date(left.createdAt || left.timestamp || 0) - new Date(right.createdAt || right.timestamp || 0);
  return delta || messageIdentity(left).localeCompare(messageIdentity(right));
};
export const mergeChatMessage = (messages = [], incoming = {}) => {
  const index = messages.findIndex((message) =>
    (incoming._id && String(message._id) === String(incoming._id)) ||
    (incoming.tempId && String(message.tempId) === String(incoming.tempId))
  );
  const next = [...messages];
  if (index >= 0) next[index] = { ...next[index], ...incoming, status: "sent" };
  else next.push({ ...incoming, status: incoming.status || "sent" });
  return next.sort(compareChatMessages);
};
