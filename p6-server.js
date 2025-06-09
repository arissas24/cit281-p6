const express = require('express');
const app = express ();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let tasks = [
    { id: 1, description: "Finish homework", completed: false },
    { id: 2, description: "Do laundry", completed: false }
];

const findTaskById = (id) =>  tasks.find(task => task.id === id);

// GET
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST 
app.post('/tasks', (req, res) => {
    const { description } = req.body;
    if (!description) {
        const error = { error: "Task description is required" };
        console.error(error);
        return res.status(400).json(error);
    }

    const newTask = {
        id: Date.now(),
        description,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { description, completed } = req.body;
    const task = findTaskById(taskId);

    if (!task) {
        const error = { error: "Task not found" };
        console.error(error);
        return res.status(404).json(error);
    }
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    res.json(task);
});

// DELETE
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        const error = { error: "Task not found" };
        console.error(error);
        return res.status(404).json(error);
    }
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
});

// 404 handler
app.use((req, res) => {
    const error = { error: "Not Found" };
    console.error("404 - Not Found:", req.originalUrl);
    res.status(404).json(error);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});