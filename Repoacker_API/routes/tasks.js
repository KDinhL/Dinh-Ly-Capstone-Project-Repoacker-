const express = require("express");
const router = express.Router();
const tasksController = require("../Controllers/tasks-controller");

// GET all tasks
router.get("/", tasksController.index);

// GET a specific task by ID
router.get("/:id", tasksController.getTask);

// CREATE a new task
router.post("/", tasksController.createTask);

// UPDATE a task by ID
router.put("/:id", tasksController.updateTask);

// DELETE a task by ID
router.delete("/:id", tasksController.deleteTask);

module.exports = router;