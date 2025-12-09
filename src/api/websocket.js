// src/api/websocket.js
// WebSocket Service for Real-time Updates

import { API_CONFIG, API_FEATURES } from './apiConfig';

// Event types for real-time updates
export const WS_EVENTS = {
  // Device events
  DEVICE_ONLINE: 'DEVICE_ONLINE',
  DEVICE_OFFLINE: 'DEVICE_OFFLINE',
  DEVICE_BLOCKED: 'DEVICE_BLOCKED',
  DEVICE_REGISTERED: 'DEVICE_REGISTERED',
  DEVICE_DELETED: 'DEVICE_DELETED',
  DATA_USAGE_UPDATE: 'DATA_USAGE_UPDATE',

  // User events
  USER_ONLINE: 'USER_ONLINE',
  USER_OFFLINE: 'USER_OFFLINE',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED',

  // Activity events
  ACTIVITY_NEW: 'ACTIVITY_NEW',

  // Alert events
  ALERT_NEW: 'ALERT_NEW',
  ALERT_RESOLVED: 'ALERT_RESOLVED',

  // System events
  CONNECTION_STATUS: 'CONNECTION_STATUS',
  ERROR: 'ERROR'
};

// Connection states
export const WS_STATE = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  RECONNECTING: 'RECONNECTING',
  ERROR: 'ERROR'
};

class WebSocketService {
  constructor() {
    this.ws = null;
    this.state = WS_STATE.DISCONNECTED;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.pingInterval = null;
    this.messageQueue = [];
  }

  /**
   * Connect to WebSocket server
   */
  connect(siteId) {
    // Skip if WebSocket is not enabled
    if (!API_FEATURES.USE_WEBSOCKET) {
      console.log('[WS] WebSocket disabled - using polling fallback');
      return;
    }

    if (this.ws && this.state === WS_STATE.CONNECTED) {
      console.log('[WS] Already connected');
      return;
    }

    this.state = WS_STATE.CONNECTING;
    this.emit(WS_EVENTS.CONNECTION_STATUS, { state: this.state });

    try {
      const url = `${API_CONFIG.WS_URL}/site/${siteId}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('[WS] Connection error:', error);
      this.handleError(error);
    }
  }

  /**
   * Handle WebSocket open
   */
  handleOpen() {
    console.log('[WS] Connected');
    this.state = WS_STATE.CONNECTED;
    this.reconnectAttempts = 0;
    this.emit(WS_EVENTS.CONNECTION_STATUS, { state: this.state });

    // Start ping interval to keep connection alive
    this.startPingInterval();

    // Send any queued messages
    this.flushMessageQueue();
  }

  /**
   * Handle incoming messages
   */
  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      const { type, data } = message;

      if (type === 'PONG') {
        // Heartbeat response - ignore
        return;
      }

      console.log('[WS] Received:', type, data);
      this.emit(type, data);
    } catch (error) {
      console.error('[WS] Message parse error:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  handleError(error) {
    console.error('[WS] Error:', error);
    this.state = WS_STATE.ERROR;
    this.emit(WS_EVENTS.CONNECTION_STATUS, { state: this.state, error });
  }

  /**
   * Handle WebSocket close
   */
  handleClose(event) {
    console.log('[WS] Disconnected:', event.code, event.reason);
    this.state = WS_STATE.DISCONNECTED;
    this.stopPingInterval();
    this.emit(WS_EVENTS.CONNECTION_STATUS, { state: this.state });

    // Attempt reconnection if not intentional close
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnection attempts reached');
      this.emit(WS_EVENTS.ERROR, { message: 'Unable to reconnect to server' });
      return;
    }

    this.state = WS_STATE.RECONNECTING;
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.emit(WS_EVENTS.CONNECTION_STATUS, {
      state: this.state,
      attempt: this.reconnectAttempts
    });

    setTimeout(() => {
      if (this.state === WS_STATE.RECONNECTING) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Start ping interval
   */
  startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.state === WS_STATE.CONNECTED) {
        this.send('PING', {});
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Send message to server
   */
  send(type, data) {
    const message = JSON.stringify({ type, data });

    if (this.ws && this.state === WS_STATE.CONNECTED) {
      this.ws.send(message);
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  /**
   * Flush queued messages
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.ws && this.state === WS_STATE.CONNECTED) {
        this.ws.send(message);
      }
    }
  }

  /**
   * Subscribe to events
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Emit event to listeners
   */
  emit(eventType, data) {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('[WS] Listener error:', error);
        }
      });
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.state = WS_STATE.DISCONNECTED;
    this.listeners.clear();
    this.messageQueue = [];
  }

  /**
   * Get current connection state
   */
  getState() {
    return this.state;
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.state === WS_STATE.CONNECTED;
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;

// Export hook for React components
export const useWebSocket = (eventHandlers = {}) => {
  // This would be a React hook in a real implementation
  // For now, return the service methods
  return {
    connect: (siteId) => websocketService.connect(siteId),
    disconnect: () => websocketService.disconnect(),
    isConnected: () => websocketService.isConnected(),
    getState: () => websocketService.getState(),
    on: (event, handler) => websocketService.on(event, handler),
    send: (type, data) => websocketService.send(type, data)
  };
};
