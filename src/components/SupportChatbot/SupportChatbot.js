// src/components/SupportChatbot/SupportChatbot.js

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaSpinner,
  FaChevronDown,
  FaLightbulb,
  FaQuestionCircle,
  FaHeadset,
  FaThumbsUp,
  FaThumbsDown,
  FaRedo,
  FaExpandAlt,
  FaCompressAlt,
} from "react-icons/fa";
import { useAuth } from "@context/AuthContext";
import "./SupportChatbot.css";

// Comprehensive FAQ responses with improved answers
const faqResponses = {
  // Account & Login
  "password reset": {
    response: "I can help you reset your password! Here's how:\n\n1. Go to the login page and click 'Forgot Password'\n2. Enter your registered email address\n3. Check your inbox (and spam folder) for the reset link\n4. Click the link and create a new secure password\n\nThe reset link is valid for 24 hours. If you don't receive it within 5 minutes, try again or contact your administrator.\n\nNeed help with something else?",
    category: "Account",
    keywords: ["forgot", "password", "reset", "recover", "cant login"],
  },
  "login issue": {
    response: "Let's troubleshoot your login issue step by step:\n\n1. Double-check your email address for typos\n2. Make sure Caps Lock is turned off\n3. Try clicking 'Show Password' to verify what you're typing\n4. Clear your browser cache: Settings > Privacy > Clear Data\n5. Try using an incognito/private window\n6. Test with a different browser (Chrome, Firefox, Edge)\n\nStill having trouble? Your account might be locked after multiple failed attempts. Contact your administrator to unlock it.\n\nWould you like me to help with password reset instead?",
    category: "Account",
    keywords: ["login", "cant", "unable", "access", "locked", "sign in"],
  },
  "change password": {
    response: "To change your password while logged in:\n\n1. Click your profile icon in the top-right corner\n2. Select 'Account Settings'\n3. Navigate to the 'Security' tab\n4. Click 'Change Password'\n5. Enter your current password for verification\n6. Create your new password and confirm it\n7. Click 'Save Changes'\n\nPassword requirements:\n- Minimum 8 characters\n- At least one uppercase letter (A-Z)\n- At least one lowercase letter (a-z)\n- At least one number (0-9)\n- Special characters recommended (!@#$%)\n\nYour session will remain active after the change.",
    category: "Account",
    keywords: ["change", "update", "new password", "modify"],
  },
  "account settings": {
    response: "You can manage your account settings by:\n\n1. Clicking your profile icon (top-right corner)\n2. Selecting 'Account Settings'\n\nFrom there, you can:\n- Update your profile information\n- Change your password\n- Manage notification preferences\n- View your activity history\n- Configure two-factor authentication\n\nNeed help with a specific setting?",
    category: "Account",
    keywords: ["settings", "profile", "account", "preferences", "configuration"],
  },

  // Device Management
  "add device": {
    response: "Great! Here's how to register a new device:\n\n1. Navigate to 'Device Management' from the sidebar\n2. Click the 'Register Device' button (top-left)\n3. Enter the device's MAC address (format: XX:XX:XX:XX:XX:XX)\n4. Fill in the device details:\n   - Device name (e.g., 'John's Laptop')\n   - Device type (Laptop, Phone, Tablet, etc.)\n   - Owner assignment\n5. Click 'Register' to complete\n\nYour device will appear in the list immediately and can connect to WiFi within 2-3 minutes.\n\nTip: You can find your MAC address in your device's network settings or on the device label.",
    category: "Device",
    keywords: ["add", "register", "new device", "connect", "mac address"],
  },
  "device not connecting": {
    response: "Let's get your device connected! Try these steps:\n\n1. Verify Registration:\n   - Go to Device Management\n   - Search for your device's MAC address\n   - Ensure it shows as 'Active' (not blocked)\n\n2. On Your Device:\n   - Turn WiFi off and on\n   - Forget the network, then reconnect\n   - Make sure you're selecting the correct network\n\n3. Check These Common Issues:\n   - Are you within range of an access point?\n   - Have you exceeded your device limit?\n   - Is the MAC address entered correctly?\n\n4. Advanced Troubleshooting:\n   - Restart your device\n   - Check for MAC randomization (disable if enabled)\n   - Try connecting at a different location\n\nStill not working? The network might be experiencing issues. Contact your network administrator for assistance.",
    category: "Device",
    keywords: ["not connecting", "cant connect", "wifi issue", "connection problem", "offline"],
  },
  "block device": {
    response: "To block a device from the network:\n\n1. Go to 'Device Management'\n2. Find the device using search or filters\n3. Click on the device card or row\n4. Click the 'Block' button (or use the actions menu)\n5. Confirm the blocking action\n\nWhat happens when blocked:\n- The device is immediately disconnected\n- It cannot reconnect until unblocked\n- The device remains in your list with 'Blocked' status\n\nTo unblock: Follow the same steps and click 'Unblock'\n\nNote: You need appropriate permissions to block devices.",
    category: "Device",
    keywords: ["block", "disconnect", "remove", "ban", "restrict"],
  },
  "device limit": {
    response: "Device limits are set based on your user policy:\n\nTypical Limits:\n- Basic Plan: 2 devices\n- Standard Plan: 3 devices  \n- Premium Plan: 5 devices\n- Enterprise: Custom limits\n\nTo check your current usage:\n1. Go to Device Management\n2. View your registered device count\n\nReached your limit? You have options:\n- Remove unused devices to free up slots\n- Request a limit increase from your administrator\n- Upgrade your plan for more devices\n\nTip: Regularly review and remove devices you no longer use!",
    category: "Device",
    keywords: ["limit", "maximum", "how many", "too many devices", "exceeded"],
  },
  "mac address": {
    response: "Here's how to find your device's MAC address:\n\nWindows:\n1. Press Win + R, type 'cmd', press Enter\n2. Type 'ipconfig /all' and press Enter\n3. Look for 'Physical Address' under your WiFi adapter\n\nMac:\n1. Click Apple menu > System Preferences\n2. Click Network > WiFi > Advanced\n3. MAC address is listed as 'WiFi Address'\n\niPhone/iPad:\n1. Go to Settings > General > About\n2. Look for 'WiFi Address'\n\nAndroid:\n1. Go to Settings > About Phone\n2. Tap 'Status' or 'Hardware Information'\n3. Look for 'WiFi MAC Address'\n\nNote: Some devices use MAC randomization. You may need to disable it for consistent connectivity.",
    category: "Device",
    keywords: ["mac address", "find mac", "physical address", "hardware address"],
  },

  // Users Management
  "add user": {
    response: "To add a new user to the system:\n\n1. Go to 'User Management' from the sidebar\n2. Click 'Add User' button\n3. Fill in the required information:\n   - Full name\n   - Email address (will be their username)\n   - Phone number\n   - Department/Segment\n   - User role (Admin, Manager, User, Viewer)\n4. Set initial password or select 'Send invitation email'\n5. Click 'Create User'\n\nThe new user will receive:\n- Welcome email with login instructions\n- Temporary password (if not using invitation link)\n- Guide to setting up their devices\n\nNote: You need Admin or Manager role to add users.",
    category: "User",
    keywords: ["add user", "create user", "new user", "invite", "onboard"],
  },
  "user role": {
    response: "Understanding user roles and permissions:\n\nAdmin:\n- Full access to all features\n- Can manage users, devices, and settings\n- Access to all reports and configurations\n\nManager:\n- Manage users within their segment\n- View and export reports\n- Limited configuration access\n\nNetwork Admin:\n- Full device management capabilities\n- Network monitoring and troubleshooting\n- Cannot manage user accounts\n\nViewer:\n- Read-only access to dashboards\n- Can view reports but not export\n- Cannot make any changes\n\nTo change a user's role, go to User Management > Select User > Edit > Change Role.\n\nNeed a different permission setup? Contact your administrator.",
    category: "User",
    keywords: ["role", "permission", "access level", "admin", "manager", "rights"],
  },
  "delete user": {
    response: "To remove a user from the system:\n\n1. Go to 'User Management'\n2. Find and select the user\n3. Click 'Delete' or the trash icon\n4. Confirm the deletion\n\nBefore deleting, consider:\n- All user's devices will be unregistered\n- User's activity logs are preserved for audit\n- This action cannot be undone\n\nAlternative: You can 'Deactivate' instead of delete to preserve the account for potential reactivation.\n\nNote: You cannot delete your own account or accounts with higher privileges.",
    category: "User",
    keywords: ["delete", "remove user", "deactivate", "disable account"],
  },
  "block user": {
    response: "To block or suspend a user from WiFi access:\n\n1. Go to 'User Management' from the sidebar\n2. Find the user using search or filters\n3. Click on the user to open their profile\n4. Click the 'Actions' menu (or three-dot icon)\n5. Select 'Block User' or 'Suspend User'\n6. Confirm the action\n\nWhat happens when a user is blocked:\n- All their registered devices are immediately disconnected\n- They cannot log in to the portal\n- Their devices cannot connect to WiFi\n- The user account remains for records and can be unblocked later\n\nTo unblock a user:\n1. Go to User Management\n2. Filter by 'Blocked' status or search for the user\n3. Click on the user and select 'Unblock User'\n\nNote: You need Admin or Manager privileges to block users.",
    category: "User",
    keywords: ["block user", "suspend user", "ban user", "disable user", "restrict user", "block", "suspend", "ban"],
  },
  "suspend user": {
    response: "To suspend a user's WiFi access:\n\n1. Go to 'User Management' from the sidebar\n2. Find and click on the user\n3. Click 'Actions' > 'Suspend User'\n4. Select suspension reason and duration (optional)\n5. Confirm the suspension\n\nSuspended users:\n- Cannot connect any devices to WiFi\n- Cannot log in to the portal\n- Devices are immediately disconnected\n- Can be reactivated anytime by an admin\n\nOptions for suspension:\n- Temporary (set duration: 1 day, 7 days, 30 days)\n- Indefinite (until manually reactivated)\n\nTo reactivate: User Management > Find User > Actions > Reactivate User\n\nNote: For permanent removal, use 'Delete User' instead.",
    category: "User",
    keywords: ["suspend", "temporary block", "deactivate", "disable", "pause access"],
  },

  // Reports & Analytics
  "generate report": {
    response: "Here's how to generate and view reports:\n\n1. Click 'Reports' in the sidebar\n2. Browse report categories:\n   - Usage Reports (bandwidth, connections)\n   - User Reports (activity, registrations)\n   - Device Reports (status, types)\n   - Security Reports (alerts, incidents)\n3. Click on any report to view it\n4. Use filters to customize:\n   - Date range\n   - User segments\n   - Device types\n5. Click 'Apply Filters' to update\n\nExport Options:\n- CSV: Raw data for spreadsheets\n- PDF: Formatted report with charts\n\nTip: Pin your frequently used reports for quick access from the dashboard!",
    category: "Reports",
    keywords: ["report", "generate", "analytics", "statistics", "data"],
  },
  "export report": {
    response: "To export your reports:\n\n1. Open the report you want to export\n2. Look for export buttons (usually top-right)\n3. Choose your format:\n\nCSV Export:\n- Best for data analysis in Excel/Sheets\n- Contains raw data in columns\n- Easy to filter and manipulate\n\nPDF Export:\n- Professional formatted document\n- Includes charts and visualizations\n- Ready for sharing or printing\n\nThe download starts automatically. Check your browser's download folder.\n\nTip: For large date ranges, CSV exports are faster and smaller.",
    category: "Reports",
    keywords: ["export", "download", "csv", "pdf", "save report"],
  },
  "dashboard": {
    response: "Your dashboard provides a quick overview of:\n\nKey Metrics:\n- Total users and devices\n- Active connections\n- Bandwidth usage\n- Recent alerts\n\nQuick Actions:\n- Register new devices\n- View recent activity\n- Access common reports\n\nCustomization:\n- Widgets auto-refresh every few minutes\n- Click any metric for detailed view\n- Use filters to focus on specific segments\n\nNeed data for a specific time period? Head to the Reports section for detailed analytics.",
    category: "Reports",
    keywords: ["dashboard", "overview", "home", "summary", "metrics"],
  },

  // Network & WiFi
  "wifi slow": {
    response: "Let's improve your WiFi speed! Try these solutions:\n\nQuick Fixes:\n1. Move closer to the access point\n2. Disconnect devices you're not using\n3. Close bandwidth-heavy apps (streaming, downloads)\n4. Restart your device's WiFi\n\nCheck Your Environment:\n- Walls and obstacles reduce signal strength\n- Microwaves and Bluetooth can cause interference\n- Peak hours (9-11 AM, 2-4 PM) have higher usage\n\nYour Bandwidth Allocation:\n- Basic: Up to 5 Mbps\n- Standard: Up to 10 Mbps\n- Premium: Up to 25 Mbps\n\nBandwidth is shared across your connected devices. Fewer active devices = faster speeds per device.\n\nStill slow? The network might be congested. Try again during off-peak hours or contact your administrator.",
    category: "Network",
    keywords: ["slow", "speed", "laggy", "buffering", "performance"],
  },
  "bandwidth": {
    response: "Understanding your bandwidth allocation:\n\nBandwidth Limits by Plan:\n- Basic: Up to 5 Mbps\n- Standard: Up to 10 Mbps\n- Premium: Up to 25 Mbps\n- Enterprise: Custom allocation\n\nHow It Works:\n- Bandwidth is shared among all your connected devices\n- 3 devices on Standard = ~3.3 Mbps each\n- Actual speeds depend on network conditions\n\nFor Reference:\n- Video calls: 2-4 Mbps recommended\n- HD streaming: 5+ Mbps recommended\n- Basic browsing: 1-2 Mbps sufficient\n\nNeed more bandwidth? Contact your administrator about upgrading your plan or increasing your allocation.",
    category: "Network",
    keywords: ["bandwidth", "speed limit", "mbps", "allocation", "throttle"],
  },
  "wifi password": {
    response: "WiFi network access works through device registration, not passwords!\n\nHow Our System Works:\n1. Your device's MAC address is registered\n2. The network recognizes your device automatically\n3. No password needed for registered devices\n\nTo Connect:\n1. Make sure your device is registered in Device Management\n2. Select the company WiFi network\n3. Your device connects automatically\n\nNot connecting? Check that:\n- Your device is registered with correct MAC address\n- Your account is active\n- You haven't exceeded device limits\n\nFor guest access, please contact your administrator.",
    category: "Network",
    keywords: ["wifi password", "network password", "connect wifi", "ssid"],
  },
  "network down": {
    response: "If you're experiencing network issues:\n\nFirst, Check If It's Widespread:\n- Ask colleagues if they're also affected\n- Check for any announced maintenance\n\nTroubleshoot Your Connection:\n1. Toggle WiFi off and on\n2. Forget network and reconnect\n3. Restart your device\n4. Try a different location/access point\n\nIf Multiple People Affected:\n- This is likely a network-wide issue\n- IT team is probably already aware\n- Check internal communications for updates\n\nTo Report an Outage:\n- Contact: support@spectra.co\n- Phone: 1800-XXX-XXXX\n- Include: Location, time started, affected devices\n\nWe apologize for any inconvenience!",
    category: "Network",
    keywords: ["network down", "outage", "no internet", "disconnected", "not working"],
  },

  // General Support
  "contact support": {
    response: "We're here to help! Reach us through:\n\nEmail Support:\nsupport@spectra.co\n(Response within 24 hours)\n\nPhone Support:\n1800-XXX-XXXX\nMonday - Saturday: 9:00 AM - 6:00 PM\n\nEmergency/Critical Issues:\nUse the emergency hotline for:\n- Complete network outages\n- Security incidents\n- Business-critical problems\n\nBefore Contacting:\n- Note your user ID/email\n- Describe the issue clearly\n- Include any error messages\n- Mention what you've already tried\n\nFor faster resolution, include screenshots if possible!",
    category: "Support",
    keywords: ["contact", "support", "help", "call", "email", "phone"],
  },
  "help": {
    response: "I'm happy to help! Here's what I can assist you with:\n\nAccount & Login:\n- Password reset and changes\n- Login troubleshooting\n- Account settings\n\nDevice Management:\n- Adding/removing devices\n- Connection issues\n- MAC address lookup\n- Device limits\n\nUser Management:\n- Adding new users\n- Understanding roles\n- Managing permissions\n\nNetwork & WiFi:\n- Connection problems\n- Speed issues\n- Bandwidth questions\n\nReports:\n- Generating reports\n- Exporting data\n- Understanding analytics\n\nJust type your question or select from the suggestions below!",
    category: "Support",
    keywords: ["help", "assist", "support", "guide", "how to"],
  },
  "thank": {
    response: "You're welcome! I'm glad I could help.\n\nIs there anything else you'd like to know? Feel free to ask about:\n- Device management\n- User accounts\n- Network issues\n- Reports and analytics\n\nHave a great day!",
    category: "Support",
    keywords: ["thank", "thanks", "appreciate", "helpful"],
  },
  "hello": {
    response: "Hello! Welcome to Spectra Support.\n\nI'm Spectra Genie, your virtual assistant! I'm here to help you with:\n\n• Account and login issues\n• Device registration and management\n• WiFi and network questions\n• Reports and analytics\n• User management\n\nHow can I assist you today? Just type your question or pick from the quick options below!",
    category: "Support",
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "greetings"],
  },
};

// Chatbot identity
const CHATBOT_NAME = "Spectra Genie";

// Quick suggestion buttons
const quickSuggestions = [
  { text: "Add a new device", query: "add device" },
  { text: "Block a user", query: "block user" },
  { text: "Reset my password", query: "password reset" },
  { text: "WiFi is slow", query: "wifi slow" },
  { text: "Find MAC address", query: "mac address" },
  { text: "Contact support", query: "contact support" },
];

// Find best matching response with improved matching
const findResponse = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  // Score-based matching for better results
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, data] of Object.entries(faqResponses)) {
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
          if (keyword.includes(word) || word.includes(keyword)) {
            score += 2;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = data.response;
    }
  }

  // Return best match if score is high enough
  if (bestScore >= 5 && bestMatch) {
    return bestMatch;
  }

  // Default response with personality
  return `I'm not quite sure about that one, but I'd love to help!\n\nHere are some things I can definitely assist with:\n\n• Device Management - Adding, connecting, or troubleshooting devices\n• Account Help - Password resets, login issues, settings\n• Network & WiFi - Speed issues, connectivity problems\n• Reports - Generating and exporting analytics\n• User Management - Adding users, roles, permissions\n\nTry asking something like:\n"How do I add a new device?"\n"My WiFi is slow"\n"Reset my password"\n\nOr click one of the quick suggestions below!`;
};

const SupportChatbot = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: `Hey${currentUser?.name ? ` ${currentUser.name.split(' ')[0]}` : ' there'}! I'm ${CHATBOT_NAME}, your virtual assistant.\n\nI can help you with device management, account issues, WiFi problems, reports, and more.\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

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
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

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
        text: `Hey${currentUser?.name ? ` ${currentUser.name.split(' ')[0]}` : ' there'}! I'm ${CHATBOT_NAME}, your virtual assistant.\n\nI can help you with device management, account issues, WiFi problems, reports, and more.\n\nWhat can I help you with today?`,
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

  return (
    <div className={`support-chatbot ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          title={`Chat with ${CHATBOT_NAME}`}
          aria-label="Open support chat"
        >
          <FaComments />
          <span className="toggle-label">{CHATBOT_NAME}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="header-text">
                <span className="bot-name">{CHATBOT_NAME}</span>
                <span className="bot-status">
                  <span className="status-dot"></span>
                  Online - Ready to help
                </span>
              </div>
            </div>
            <div className="header-actions">
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
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
              </button>
              <button
                className="header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

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
            <FaHeadset /> Need human support?{" "}
            <a href="/knowledge" onClick={(e) => { e.preventDefault(); setIsOpen(false); }}>
              Visit Knowledge Center
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatbot;
