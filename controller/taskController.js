// controllers/taskController.js
const Task = require("../modals/taskModels");
const { sendTaskCompletionEmail } = require("../services/emailService");


// Search tasks by title or description
exports.searchTasks = async (req, res) => {
  try {
    const { searchTerm } = req.query; // Search term from query params

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Search tasks where the title or description contains the search term (case-insensitive)
    const tasks = await Task.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },       // Search in title
        { description: { $regex: searchTerm, $options: "i" } }  // Search in description
      ]
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found matching the search term" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error searching tasks", error });
  }
};




exports.filterTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = "createdAt", order = "asc", page = 1, limit = 10 } = req.query;

    // Build the filter criteria
    let filterCriteria = {};
    if (status) {
      filterCriteria.status = status;
    }
    if (priority) {
      filterCriteria.priority = priority;
    }

    // Determine sorting order (ascending or descending)
    const sortOrder = order === "asc" ? 1 : -1;

    // Pagination and sorting logic
    const tasks = await Task.find(filterCriteria)
      .sort({ [sortBy]: sortOrder }) // Sort by the specified field and order
      .skip((page - 1) * limit)      // Pagination logic
      .limit(parseInt(limit));       // Limit the number of results

    const totalTasks = await Task.countDocuments(filterCriteria); // Total number of tasks matching the filter

    res.status(200).json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const newTask = new Task({ title, description, priority, status });
    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

// Mark task as completed and send email notification
exports.markTaskAsComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "Completed";
    await task.save();

    // Send email notification
    const { email } = req.body;
    sendTaskCompletionEmail(email, task);

    res.status(200).json({ message: "Task marked as completed and email sent", task });
  } catch (error) {
    res.status(500).json({ message: "Error marking task as completed", error });
  }
};

// Generate task summary
exports.generateTaskSummary = async (req, res) => {
  try {
    const tasks = await Task.find({});
    const summary = {
      pendingCount: tasks.filter(task => task.status === "Pending").length,
      completedCount: tasks.filter(task => task.status === "Completed").length,
    };
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: "Error generating task summary", error });
  }
};
