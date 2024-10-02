// services/websocketService.js
const WebSocket = require("ws");

exports.setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Broadcast data to all connected clients
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Handle new WebSocket connections
  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return broadcast;
};
