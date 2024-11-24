

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const port = 5002;

app.use(cors());
app.use(bodyParser.json());

//conexion
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "agenda",
});

//consultar base de datos
app.get("/todos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM  todo");
    console.log(rows)
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("error al obtener las tareas");
  }
});

//agregar datos a la base de datos,

app.post("/todos", async (req, res) => {
  console.log( req.body)
  const { text } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO todo(text,completed) VALUES(?,?)",
      [text, false]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).send("error al agregar tarea");
  }
});

//acutalizar  tabla

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    if (text !== undefined) {
      await pool.query("UPDATE todo SET completed =? WHERE ID =?", [
        completed,
        id,
      ]);
      res.json({ message: "Tarea actualizada correctamente" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send("error al actualizar la tarea");
  }
});
//eliminar  datos dentro de la  tabla

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todo WHERE ID=?", [id]);
    res.json({ message: "tarea eliminada" });
  } catch (error) {
    console.log("error ", error);
    res.status(500).send("error al eliminar tarea!");
  }
});

//iniciar  servidor

app.listen(port, () => {
  console.log(`servidor ejecutandose en el puerto ${port}`);
});
 
