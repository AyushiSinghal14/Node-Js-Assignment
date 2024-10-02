# Task Management API

## Overview

This Task Management API is built using *Node.js, **Express, **MongoDB, and **WebSockets*. It allows users to manage tasks with functionality for creating, updating, deleting, and marking tasks as complete. It also includes features for filtering, searching tasks by title or description, and real-time task updates using WebSockets.

## Features

- *CRUD Operations*: Create, read, update, and delete tasks.
- *Real-time Updates*: WebSocket support to notify clients of real-time task updates.
- *Task Filtering*: Filter tasks by status and priority, with pagination and sorting.
- *Task Search*: Search for tasks based on keywords found in the title or description.
- *Email Notifications*: Email notifications are sent when a task is marked as complete.

---

## Project Structure

<pre>
project-root/
├── config/
│   └── database.js         # MongoDB connection logic
├── controllers/
│   └── taskController.js    # Handles task-related logic (CRUD, filtering, searching, etc.)
├── models/
│   └── taskModel.js         # Task schema definition using Mongoose
├── routes/
│   └── taskRoutes.js        # All task-related API routes
├── services/
│   ├── emailService.js      # Nodemailer logic for sending emails
│   └── websocketService.js  # WebSocket logic for real-time updates
├── .env                     # Environment variables (MongoDB URL, email credentials, etc.)
├── index.js                 # Main entry point (Express server, WebSocket setup, routes)
├── package.json             # Project dependencies
└── README.md                # Documentation for the project
</pre>



---

## Prerequisites

Make sure you have the following installed:
- *Node.js* (version 14.x or higher)
- *npm* (Node Package Manager)
- *MongoDB* (Running locally or using MongoDB Atlas)

---

## Setup Instructions

### 1. Clone the Repository

bash
git clone https://github.com/your-repo/task-management-api.git
cd task-management-api


### 2. Install Dependencies

bash
npm install


### 3. Set Up Environment Variables

Create a .env file in the project root and add the following:

bash
MONGODB_URL=your_mongodb_url
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password


- *MONGODB_URL*: Your MongoDB connection string (local or Atlas).
- *EMAIL_USER* and *EMAIL_PASS*: Credentials for sending emails via Gmail (or another SMTP provider).

### 4. Start the Server

bash
npm start


The server will run on the port defined in the .env file, or on port 3000 by default.

---

## API Endpoints

### 1. *Create a Task*

- *Endpoint*: POST /api/tasks
- *Description*: Creates a new task.
- *Request Body*:

json
{
  "title": "Complete the project",
  "description": "Finish the Node.js project by Friday",
  "priority": "High",
  "status": "Pending"
}


- *Response*:

json
{
  "message": "Task created successfully",
  "task": { ... }  // Created task object
}


---

### 2. *Get a Task by ID*

- *Endpoint*: GET /api/tasks/:id
- *Description*: Fetch a specific task by its ID.
- *Response*:

json
{
  "task": { ... }  // Task object with the given ID
}


---

### 3. *Update a Task by ID*

- *Endpoint*: PUT /api/tasks/:id
- *Description*: Update the details of a task.
- *Request Body* (Example):

json
{
  "title": "Update the project",
  "description": "Updated task description",
  "priority": "Medium",
  "status": "Pending"
}


- *Response*:

json
{
  "message": "Task updated successfully",
  "task": { ... }  // Updated task object
}


---

### 4. *Delete a Task by ID*

- *Endpoint*: DELETE /api/tasks/:id
- *Description*: Delete a task by its ID.
- *Response*:

json
{
  "message": "Task deleted successfully"
}


---

### 5. *Mark a Task as Complete*

- *Endpoint*: PUT /api/tasks/:id/complete
- *Description*: Mark a task as complete and send an email notification.
- *Request Body*:

json
{
  "email": "user@example.com"
}


- *Response*:

json
{
  "message": "Task marked as completed and email sent",
  "task": { ... }  // Updated task object
}


---

### 6. *Filter, Paginate, and Sort Tasks*

- *Endpoint*: GET /api/tasks
- *Description*: Retrieve a list of tasks filtered by status, priority, and with pagination and sorting.
- *Query Parameters*:
  - status: Filter by task status (e.g., Pending, Completed).
  - priority: Filter by task priority (High, Medium, Low).
  - sortBy: Sort by field (e.g., title, createdAt).
  - order: Sort order (asc for ascending, desc for descending).
  - page: Page number for pagination.
  - limit: Number of tasks per page.

- *Example*: Get all Pending tasks, sorted by title in ascending order, on page 2 with 5 tasks per page.

http
GET /api/tasks?status=Pending&sortBy=title&order=asc&page=2&limit=5


- *Response*:

json
{
  "tasks": [ ... ],  // List of tasks
  "currentPage": 2,
  "totalPages": 5,
  "totalTasks": 25
}


---

### 7. *Search Tasks by Title or Description*

- *Endpoint*: GET /api/tasks/search
- *Description*: Search for tasks by title or description.
- *Query Parameter*: 
  - searchTerm: The keyword to search in the title or description.

- *Example*: Search for tasks with "project" in the title or description.

http
GET /api/tasks/search?searchTerm=project


- *Response*:

json
{
  "tasks": [ ... ]  // List of matching tasks
}


---

### 8. *Task Summary*

- *Endpoint*: GET /api/tasks/summary
- *Description*: Get a summary of pending and completed tasks.
- *Response*:

json
{
  "summary": {
    "pendingCount": 10,
    "completedCount": 5
  }
}


---

## Real-Time Updates with WebSockets

The API includes WebSocket functionality for real-time task updates. When tasks are updated, the changes are broadcast to all connected clients.

To connect to the WebSocket server:

javascript
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  console.log("Connected to WebSocket server");
};

socket.onmessage = (event) => {
  console.log("Task update received:", event.data);
};

socket.onclose = () => {
  console.log("Disconnected from WebSocket server");
};


---

## Running Tests (Optional)

You can implement and run unit tests using frameworks like *Mocha* or *Jest*. Tests are essential for ensuring the quality and reliability of the API.

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it, but it comes with no warranties.

---

## Conclusion

This project provides a comprehensive task management system with CRUD operations, real-time updates via WebSockets, email notifications, filtering, sorting, pagination, and searching functionality. It’s well-structured and easy to extend, making it a great base for larger task management systems or projects that require real-time collaboration.
