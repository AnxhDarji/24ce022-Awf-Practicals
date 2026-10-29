const express = require("express");

const app = express();
const PORT = 8000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        description: "Study Express and REST APIs",
        completed: false
    },
    {
        id: 2,
        title: "Build Task API",
        description: "Create CRUD endpoints",
        completed: true
    }
];


app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});


app.post("/tasks", (req, res, next) => {
    try {
        const { title, description, completed } = req.body;

        if (!title) {
            const error = new Error("Title is required");
            error.status = 400;
            throw error;
        }

        const newTask = {
            id: tasks.length > 0
                ? tasks[tasks.length - 1].id + 1
                : 1,
            title,
            description: description || "",
            completed: completed || false
        };

        tasks.push(newTask);

        res.status(201).json(newTask);

    } catch (error) {
        next(error);
    }
});


app.put("/tasks/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const task = tasks.find(task => task.id === id);

        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }

        const { title, description, completed } = req.body;

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (completed !== undefined) {
            task.completed = completed;
        }

        res.status(200).json(task);

    } catch (error) {
        next(error);
    }
});

app.delete("/tasks/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });

    } catch (error) {
        next(error);
    }
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: err.message || "Something went wrong"
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});