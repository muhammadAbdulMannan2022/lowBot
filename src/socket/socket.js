class WebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
  }

  connect({ route, token }) {
    if (this.socket) return; // Already connected
    this.socket = new WebSocket(
      `ws://devidcyrus.duckdns.org${route}?Authorization=Bearer ${token}`
    );

    this.socket.onopen = () => {
      console.log("WebSocket connected", route);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach((cb) => cb(data));
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", { error, route });
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected", route);
      this.socket = null;
    };
  }

  send(data) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("Socket not connected");
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }
}

const wsManager = new WebSocketManager();
export default wsManager;
