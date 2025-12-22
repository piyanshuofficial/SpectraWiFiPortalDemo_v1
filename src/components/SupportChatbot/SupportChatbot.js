// src/components/SupportChatbot/SupportChatbot.js

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaSpinner,
  FaChevronUp,
  FaLightbulb,
  FaHeadset,
  FaThumbsUp,
  FaThumbsDown,
  FaRedo,
  FaExpandAlt,
  FaCompressAlt,
  FaGripHorizontal,
  FaMinus,
} from "react-icons/fa";
import { useAuth } from "@context/AuthContext";
import { useSegment } from "../../context/SegmentContext";
import { usePermissions } from "../../hooks/usePermissions";
import {
  customerKnowledge,
  internalKnowledge,
  getSegmentRestrictedMessage,
  getRoleRestrictedMessage,
} from "../../constants/chatbotKnowledge";
import { UserTypes } from "../../utils/accessLevels";
import "./SupportChatbot.css";

// Chatbot identity
const CHATBOT_NAME = "Spectra Genie";

// Quick suggestions for customer portal (role-aware)
const getCustomerQuickSuggestions = (role, canAddDevice) => {
  const suggestions = [
    { text: "Reset my password", query: "password reset" },
    { text: "WiFi is slow", query: "wifi slow" },
    { text: "Find MAC address", query: "mac address" },
    { text: "Contact support", query: "contact support" },
  ];

  // Add role-specific suggestions
  if (role === "admin" || role === "manager") {
    suggestions.unshift({ text: "Add a new user", query: "add user" });
    if (canAddDevice) {
      suggestions.unshift({ text: "Add a new device", query: "add device" });
    }
  }

  return suggestions.slice(0, 6); // Max 6 suggestions
};

// Quick suggestions for internal portal (role-aware)
const getInternalQuickSuggestions = (role) => {
  const suggestions = [];

  if (role === "super_admin" || role === "operations_manager" || role === "deployment_engineer") {
    suggestions.push({ text: "Site Provisioning", query: "site provisioning" });
  }

  if (role === "super_admin" || role === "operations_manager") {
    suggestions.push({ text: "Bulk Operations", query: "bulk operations" });
  }

  if (role === "super_admin" || role === "operations_manager" || role === "support_engineer" || role === "sales_representative") {
    suggestions.push({ text: "Customer Impersonation", query: "customer impersonation" });
  }

  suggestions.push(
    { text: "Authentication Issues", query: "authentication troubleshooting" },
    { text: "Escalation Procedures", query: "escalation" },
    { text: "Internal Roles", query: "internal roles" }
  );

  return suggestions.slice(0, 6);
};

const SupportChatbot = () => {
  const { currentUser } = useAuth();
  const { currentSegment } = useSegment();
  const { canAddUserDevice, canEditUsers, canManageDevices } = usePermissions();

  // Determine if internal user
  const isInternalUser = currentUser?.userType === UserTypes.INTERNAL;
  const userRole = currentUser?.role || "user";

  // Select appropriate knowledge base
  const knowledgeBase = useMemo(() => {
    return isInternalUser ? internalKnowledge : customerKnowledge;
  }, [isInternalUser]);

  // Get role-aware quick suggestions
  const quickSuggestions = useMemo(() => {
    if (isInternalUser) {
      return getInternalQuickSuggestions(userRole);
    }
    return getCustomerQuickSuggestions(userRole, canAddUserDevice);
  }, [isInternalUser, userRole, canAddUserDevice]);

  // Find best matching response with segment and role awareness
  const findResponse = useCallback((query) => {
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    let bestMatch = null;
    let bestScore = 0;
    let bestKey = null;

    for (const [key, data] of Object.entries(knowledgeBase)) {
      let score = 0;

      // Check main key match
      if (normalizedQuery.includes(key)) {
        score += 10;
      }

      // Check individual key words
      const keyWords = key.split(" ");
      for (const kw of keyWords) {
        if (normalizedQuery.includes(kw)) {
          score += 3;
        }
      }

      // Check additional keywords if available
      if (data.keywords) {
        for (const keyword of data.keywords) {
          if (normalizedQuery.includes(keyword)) {
            score += 5;
          }
          // Partial keyword match
          for (const word of queryWords) {
            if (word.length > 2 && (keyword.includes(word) || word.includes(keyword))) {
              score += 2;
            }
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = data;
        bestKey = key;
      }
    }

    // Return best match if score is high enough
    if (bestScore >= 5 && bestMatch) {
      // Check for segment restrictions (customer portal only)
      if (!isInternalUser && currentSegment) {
        const segmentRestriction = getSegmentRestrictedMessage(bestMatch, currentSegment);
        if (segmentRestriction) {
          return segmentRestriction;
        }
      }

      // Check for role restrictions
      const roleRestriction = getRoleRestrictedMessage(bestMatch, userRole);
      if (roleRestriction) {
        return roleRestriction;
      }

      return bestMatch.response;
    }

    // Default response based on portal type
    if (isInternalUser) {
      return `I'm not quite sure about that one. Let me help you navigate the internal portal!\n\n**I can assist with:**\n\n• **Site Management** - Provisioning, configuration, testing\n• **Customer Operations** - Impersonation, onboarding, licensing\n• **Bulk Operations** - Mass updates, imports, exports\n• **Troubleshooting** - Authentication, connectivity, escalation\n• **Configuration** - Segments, permissions, RADIUS\n\n**Try asking:**\n"How do I provision a new site?"\n"Explain customer impersonation"\n"Authentication troubleshooting guide"\n\nOr click one of the quick suggestions above!`;
    }

    return `I'm not quite sure about that one, but I'd love to help!\n\n**Here are some things I can assist with:**\n\n• **User Management** - Adding, editing, managing users\n• **Device Management** - Registration, troubleshooting devices\n• **Account Help** - Password resets, login issues, settings\n• **Network & WiFi** - Speed issues, connectivity problems\n• **Reports** - Generating and exporting analytics\n• **Guest Management** - Temporary access for visitors\n\n**Try asking something like:**\n"How do I add a new user?"\n"My device won't connect"\n"Reset my password"\n\nOr click one of the quick suggestions below!`;
  }, [knowledgeBase, isInternalUser, currentSegment, userRole]);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Initial greeting based on portal type
  const getInitialGreeting = useCallback(() => {
    const userName = currentUser?.name ? ` ${currentUser.name.split(' ')[0]}` : ' there';

    if (isInternalUser) {
      return `Hey${userName}! I'm ${CHATBOT_NAME}, your internal portal assistant.\n\nI can help you with site provisioning, customer management, bulk operations, troubleshooting, and more.\n\nWhat can I help you with today?`;
    }

    return `Hey${userName}! I'm ${CHATBOT_NAME}, your virtual assistant.\n\nI can help you with user management, device registration, account issues, WiFi problems, reports, and more.\n\nWhat can I help you with today?`;
  }, [currentUser, isInternalUser]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: getInitialGreeting(),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Draggable state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const chatbotRef = useRef(null);

  // Update initial message when user changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        text: getInitialGreeting(),
        timestamp: new Date(),
      },
    ]);
  }, [currentUser?.id, isInternalUser, getInitialGreeting]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Listen for external open chatbot event
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('openSpectraGenie', handleOpenChatbot);
    return () => {
      window.removeEventListener('openSpectraGenie', handleOpenChatbot);
    };
  }, []);

  // Dragging handlers
  const handleDragStart = useCallback((e) => {
    if (e.target.closest('.header-btn') || e.target.closest('.chatbot-input')) return;

    setIsDragging(true);
    setHasDragged(false);
    const chatbot = chatbotRef.current;
    if (chatbot) {
      const rect = chatbot.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  }, []);

  const handleToggleDragStart = useCallback((e) => {
    setIsDragging(true);
    setHasDragged(false);
    const chatbot = chatbotRef.current;
    if (chatbot) {
      const rect = chatbot.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    const chatbot = chatbotRef.current;
    if (chatbot) {
      const rect = chatbot.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      if (position.x !== constrainedX || position.y !== constrainedY) {
        setHasDragged(true);
      }

      setPosition({
        x: constrainedX,
        y: constrainedY,
      });
    }
  }, [isDragging, dragOffset, position.x, position.y]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleToggleClick = useCallback(() => {
    if (!hasDragged) {
      setIsOpen(true);
    }
    setHasDragged(false);
  }, [hasDragged]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const handleSendMessage = async (query = inputValue) => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = findResponse(query);

    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      text: response,
      timestamp: new Date(),
      canFeedback: true,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.query);
  };

  const handleFeedback = (messageId, isPositive) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: isPositive ? "positive" : "negative" }
          : msg
      )
    );
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        text: getInitialGreeting(),
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const chatbotStyle = position.x !== null && position.y !== null
    ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
    : {};

  // Footer link based on portal type
  const footerLink = isInternalUser ? "/internal/knowledge" : "/support";
  const footerText = isInternalUser ? "Internal Knowledge Base" : "Help & Support";

  return (
    <div
      ref={chatbotRef}
      className={`support-chatbot ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""} ${isMinimized ? "minimized" : ""} ${isDragging ? "dragging" : ""}`}
      style={chatbotStyle}
    >
      {/* Chat Toggle Button - Draggable */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onMouseDown={handleToggleDragStart}
          onClick={handleToggleClick}
          title={`Chat with ${CHATBOT_NAME} (drag to move)`}
          aria-label="Open support chat"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <FaComments />
          <span className="toggle-label">{CHATBOT_NAME}</span>
          <span className="drag-hint">
            <FaGripHorizontal />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header - Draggable Area */}
          <div
            className="chatbot-header"
            onMouseDown={handleDragStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="header-info">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="header-text">
                <span className="bot-name">{CHATBOT_NAME}</span>
                <span className="bot-status">
                  <span className="status-dot"></span>
                  {isMinimized ? "Click to expand" : "Online - Ready to help"}
                </span>
              </div>
            </div>
            <div className="header-actions">
              {!isMinimized && (
                <>
                  <button
                    className="header-btn"
                    onClick={handleReset}
                    title="Start new conversation"
                  >
                    <FaRedo />
                  </button>
                  <button
                    className="header-btn"
                    onClick={toggleExpand}
                    title={isExpanded ? "Compress" : "Expand"}
                  >
                    {isExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
                  </button>
                </>
              )}
              <button
                className="header-btn"
                onClick={toggleMinimize}
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <FaChevronUp /> : <FaMinus />}
              </button>
              <button
                className="header-btn close-btn"
                onClick={handleClose}
                title="Close chat"
              >
                <FaTimes />
              </button>
            </div>
            {/* Drag indicator */}
            <div className="drag-indicator" title="Drag to move">
              <FaGripHorizontal />
            </div>
          </div>

          {/* Chat Content - Hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.type === "bot" ? "bot-message" : "user-message"}`}
                  >
                    <div className="message-avatar">
                      {message.type === "bot" ? <FaRobot /> : <FaUser />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {message.canFeedback && !message.feedback && (
                          <div className="feedback-buttons">
                            <button
                              className="feedback-btn"
                              onClick={() => handleFeedback(message.id, true)}
                              title="Helpful"
                            >
                              <FaThumbsUp />
                            </button>
                            <button
                              className="feedback-btn"
                              onClick={() => handleFeedback(message.id, false)}
                              title="Not helpful"
                            >
                              <FaThumbsDown />
                            </button>
                          </div>
                        )}
                        {message.feedback && (
                          <span className={`feedback-received ${message.feedback}`}>
                            {message.feedback === "positive" ? "Thanks for the feedback!" : "We'll improve this"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message bot-message typing">
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {showSuggestions && messages.length <= 1 && (
                <div className="quick-suggestions">
                  <div className="suggestions-header">
                    <FaLightbulb /> Quick questions
                  </div>
                  <div className="suggestions-list">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="chatbot-input">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
                <button
                  className="send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  title="Send message"
                >
                  {isTyping ? <FaSpinner className="spin" /> : <FaPaperPlane />}
                </button>
              </div>

              {/* Footer */}
              <div className="chatbot-footer">
                <FaHeadset /> Need more help?{" "}
                <a href={footerLink} onClick={(e) => { e.preventDefault(); handleClose(); window.location.href = footerLink; }}>
                  Visit {footerText}
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportChatbot;
