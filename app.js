const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app = express();
dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());

// Run server
let db = null;
const RunDataBase = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("SERVER RUNNING http://localhost:3000");
  });
};

RunDataBase();

// Create Table in DB USI SQLITE IN TERMINAL

// API 1

app.get("/todos/", async (request, response) => {
  const { search_q = "", status = "", priority = "" } = request.query;

  const getQuery = `
    SELECT * 
    FROM todo
    WHERE 
        status LIKE '%${status}%' AND
        todo LIKE '%${search_q}%' AND
        priority LIKE '%${priority}%';`;

  let details = await db.all(getQuery);
  response.send(details);
});

//  API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getBasedOnId = `
        SELECT * 
        FROM todo
        WHERE id = ${todoId};`;

  let todo = await db.get(getBasedOnId);
  response.send(todo);
});

// API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const addTodo = `
  INSERT INTO todo 
  (id, todo, priority, status)
  VALUES (${id}, '${todo}', '${priority}', '${status}');`;

  await db.run(addTodo);
  response.send("Todo Successfully Added");
});

// PUT IN SPECIFIC ROW

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const { status, priority, todo } = request.body;

  let column = "";
  let value = "";

  const getItem = (status, priority, todo) => {
    if (status !== undefined) {
      column = "Status";
      value = status;
    } else if (priority !== undefined) {
      column = "Priority";
      value = priority;
    } else {
      column = "Todo";
      value = todo;
    }
  };

  getItem(status, priority, todo);

  const updateQuery = `
    UPDATE todo 
    SET '${column}' = '${value}';`;

  await db.run(updateQuery);
  response.send(`${column} Updated`);
});

// DELETE API

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const deleteQuery = `
    DELETE 
    FROM todo
    WHERE 
        id = ${todoId};`;

  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
