import io, { Socket } from 'socket.io-client';
import { API_URL } from '../config/constants';

interface EventListener {
  event: string;
  callback: (...args: any[]) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: EventListener[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  // Connect to Socket.IO server
  connect(token: string) {
    try {
      // Disconnect existing connection if any
      if (this.socket) {
        this.socket.disconnect();
      }

      // Create new connection
      this.socket = io(API_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      // Set up basic event listeners
      this.setupBasicEventListeners();

      return true;
    } catch (error) {
      console.error('Socket connection error:', error);
      return false;
    }
  }

  private setupBasicEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('reconnect_attempt', () => {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
    });
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = [];
    }
  }

  // Add connection listener
  onConnect(callback: () => void) {
    if (this.socket) {
      this.socket.on('connect', callback);
    }
  }

  // Emit event to server
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
      return true;
    }
    return false;
  }

  // Subscribe to server event
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for management
      this.listeners.push({ event, callback });
      return true;
    }
    return false;
  }

  // Remove specific listener
  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove listener from list
      this.listeners = this.listeners.filter(
        listener => !(listener.event === event && listener.callback === callback)
      );
    }
  }

  // Unsubscribe all listeners from specific event
  removeAllListeners(event: string) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      
      // Clean up listeners list
      this.listeners = this.listeners.filter(listener => listener.event !== event);
    }
  }

  // Join a room
  joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit('join_room', room);
    }
  }

  // Leave a room
  leaveRoom(room: string) {
    if (this.socket) {
      this.socket.emit('leave_room', room);
    }
  }

  // Send message to room
  sendToRoom(room: string, event: string, data: any) {
    if (this.socket) {
      this.socket.emit('room_message', { room, event, data });
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance of the service
const socketService = new SocketService();
export default socketService;