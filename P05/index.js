const express = require('express');
const app = express();
const { Task } = require("./models/task");
const connectMongoDB = require("./connection");
app.use(express.json());

mem = []
connectMongoDB("mongodb://127.0.0.1:27017/tasks");

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});

    return res.json(tasks);
})

app.post('/tasks', async (req, res) => {
    const task = req.body;
    mem.push(task);

    const inputTask = await Task.create(task);

    return res.json(inputTask);
})

app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    if (mem[id] !== undefined) {
        mem[id] = req.body;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body);
    
    return res.json(req.body);
})

app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    if (mem[id] !== undefined) {
        mem.splice(id, 1);
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    
    return res.json({
        message: "Deleted Succesfully!",
    })
})

app.listen(8000, () => {
    console.log("Successful connection on PORT 8000");
})
