// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");

// Define task-related routes
router.post("/tasks", taskController.addTask);
router.get("/tasks/:id", taskController.getTask);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.put("/tasks/:id/complete", taskController.markTaskAsComplete);
router.get("/tasks/summary", taskController.generateTaskSummary);
router.get("/tasks", taskController.filterTasks);
router.get("/tasks/search", taskController.searchTasks);

module.exports = router;
