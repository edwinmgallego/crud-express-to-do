
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(bodyParser.json());

let todos = []; // Base de datos temporal en memoria
let currentID = 1;

// Obtener todas las tareas
app.get("/todos", (req, res) => {
    res.json(todos);
    console.log(todos)
});

// Agregar nueva tarea
app.post("/todos", (req, res) => {
    const { text } = req.body;
    console.log(text);
    if (!text) {
        return res.status(400).json({ error: "El texto es obligatorio." });
    }

    const newTodo = {
        ID: currentID++,
        text,
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Actualizar tarea por ID
app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todo = todos.find((t) => t.ID === parseInt(id));

    if (!todo) {
        return res.status(404).json({ error: "Tarea no encontrada." });
    }

    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

// Eliminar tarea por ID
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    todos = todos.filter((t) => t.ID !== parseInt(id));
    res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
