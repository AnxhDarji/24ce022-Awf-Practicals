
const express = require("express");

const app = express();

app.use(express.json());

let tasks = [
  { id: 1, title: "Complete Practical 12", completed: false },
  { id: 2, title: "Learn GitHub Actions", completed: false }
];

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Management API is running"
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// Create a task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const newTask = {
    id: tasks.length
      ? Math.max(...tasks.map(task => task.id)) + 1
      : 1,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const existingTask = tasks.find(task => task.id === id);

  if (!existingTask) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks = tasks.filter(task => task.id !== id);

  res.status(200).json({
    message: "Task deleted successfully"
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
