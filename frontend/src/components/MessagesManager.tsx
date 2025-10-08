import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MessagesManager.css";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Mark message as read
  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg.id === id ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Delete message
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        alert("Message deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error deleting message: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message");
    }
  };

  // Open message detail
  const openMessage = async (message: Contact) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      await markAsRead(message.id);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    if (filter === "unread") return !message.is_read;
    if (filter === "read") return message.is_read;
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="messages-manager">
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="messages-manager"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="messages-header" variants={itemVariants}>
        <h2>Messages Management</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({messages.length})
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({messages.filter((m) => !m.is_read).length})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({messages.filter((m) => m.is_read).length})
          </button>
        </div>
      </motion.div>

      <motion.div className="messages-stats" variants={itemVariants}>
        <div className="stat-card">
          <div className="stat-number">{messages.length}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {messages.filter((m) => !m.is_read).length}
          </div>
          <div className="stat-label">Unread</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {
              messages.filter(
                (m) =>
                  m.created_at >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              ).length
            }
          </div>
          <div className="stat-label">This Week</div>
        </div>
      </motion.div>

      <div className="messages-content">
        <motion.div className="messages-list" variants={itemVariants}>
          {filteredMessages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📧</div>
              <h3>No Messages</h3>
              <p>
                {filter === "all"
                  ? "No messages have been received yet."
                  : `No ${filter} messages found.`}
              </p>
            </div>
          ) : (
            <div className="messages-grid">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message-card ${!message.is_read ? "unread" : ""}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openMessage(message)}
                >
                  <div className="message-header">
                    <div className="message-sender">
                      <h3>{message.name}</h3>
                      <span className="message-email">{message.email}</span>
                    </div>
                    <div className="message-meta">
                      {!message.is_read && (
                        <div className="unread-indicator"></div>
                      )}
                      <span className="message-date">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="message-subject">
                    <strong>{message.subject}</strong>
                  </div>

                  <div className="message-preview">
                    {message.message.length > 150
                      ? `${message.message.substring(0, 150)}...`
                      : message.message}
                  </div>

                  <div
                    className="message-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="reply-btn"
                      onClick={() =>
                        window.open(
                          `mailto:${message.email}?subject=Re: ${message.subject}`
                        )
                      }
                    >
                      📧 Reply
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(message.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              className="message-detail-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="sender-info">
                  <h3>{selectedMessage.name}</h3>
                  <span className="sender-email">{selectedMessage.email}</span>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedMessage(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="message-details">
                  <div className="detail-row">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">
                      {selectedMessage.subject}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Received:</span>
                    <span className="detail-value">
                      {formatDate(selectedMessage.created_at)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`status-badge ${
                        selectedMessage.is_read ? "read" : "unread"
                      }`}
                    >
                      {selectedMessage.is_read ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>

                <div className="message-body">
                  <h4>Message:</h4>
                  <div className="message-text">{selectedMessage.message}</div>
                </div>

                <div className="modal-actions">
                  <button
                    className="reply-button"
                    onClick={() =>
                      window.open(
                        `mailto:${selectedMessage.email}?subject=Re: ${
                          selectedMessage.subject
                        }&body=${encodeURIComponent(
                          `Hi ${selectedMessage.name},\n\nThank you for your message:\n\n"${selectedMessage.message}"\n\nBest regards,`
                        )}`
                      )
                    }
                  >
                    📧 Reply via Email
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      handleDelete(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    🗑️ Delete Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagesManager;
