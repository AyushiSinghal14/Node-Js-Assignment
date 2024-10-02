// index.js
const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const taskRoutes = require("./route/taskRoute");

// Import services
const connectDB = require("./config/database");
const { setupWebSocket } = require("./services/websocketService");

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the build folder (for frontend)
app.use(express.static(path.resolve(__dirname, "build")));

// Use task routes
app.use("/api", taskRoutes);

// Connect to MongoDB
connectDB();

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
const broadcast = setupWebSocket(server);

// Listen for task updates and broadcast via WebSocket
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
    if (task) {
      broadcast({ event: "taskUpdated", data: task });
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
