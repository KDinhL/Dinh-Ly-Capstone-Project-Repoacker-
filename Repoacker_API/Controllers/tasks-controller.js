const knex = require("knex")(require("../knexfile"));

const index = (req, res) => {
  knex("tasks")
    .select(
      "tasks.id",
      "projects.project_name",
      "tasks.task_name",
      "tasks.task_description",
      "tasks.task_start_date",
      "tasks.task_deadline",
      "tasks.task_status_percentage",
      "tasks.task_problem",
      "tasks.task_solution"
    )
    .join("projects", "tasks.project_id", "projects.id")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Tasks: ${err}`)
    );
};

const getTask = (req, res) => {
  const taskId = req.params.id;

  knex("tasks")
    .where("tasks.id", taskId)
    .first()
    .join("projects", "tasks.project_id", "projects.id")
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json(task);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: `An error occurred while fetching task with ID: ${taskId}`,
      });
    });
};

const updateTask = (req, res) => {
  const requiredUpdateProperties = [
    "project_id",
    "task_name",
    "task_description",
    "task_start_date",
    "task_deadline",
    "task_status_percentage",
    "task_problem",
    "task_solution"
  ];

  const hasAllProperties = (obj, props) => {
    for (var i = 0; i < props.length; i++) {
      if (!obj.hasOwnProperty(props[i])) return false;
    }
    return true;
  };

  if (!hasAllProperties(req.body, requiredUpdateProperties)) {
    res.status(400).json({
      message: `One or more missing properties in request body`,
    });
    return;
  }

  if (isNaN(req.body.task_status_percentage)) {
    res.status(400).json({
      message: `Task status percentage is not a number`,
    });
    return;
  }

  knex("projects")
    .where({ id: req.body.project_id })
    .then((projectsFound) => {
      if (projectsFound.length === 0) {
        return res.status(400).json({
          message: `Project ID: ${req.body.project_id} within task does not exist`,
        });
      }
      knex("tasks")
        .where({ id: req.params.id })
        .update(req.body)
        .then(() => {
          return knex("tasks")
            .where({
              id: req.params.id,
            })
            .select("id", ...requiredUpdateProperties);
        })
        .then((updatedTask) => {
          res.status(200).json(updatedTask[0]);
        })
        .catch(() => {
          res.status(404).json({
            message: `Task with ID: ${req.params.id} not found`,
          });
        });
    });
};

const deleteTask = (req, res) => {
  const taskId = req.params.id;
  knex("tasks")
    .where("id", taskId)
    .del()
    .then(deleteItem => {
      if (deleteItem === 0) {
        return res.status(404).json({ message: `Task with ID: ${req.params.id} to be deleted not found.` });
      }
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Unable to delete task' });
    });
};

const createTask = (req, res) => {
  const newTask = {
    project_id: req.body.project_id,
    task_name: req.body.task_name,
    task_description: req.body.task_description,
    task_start_date: req.body.task_start_date,
    task_deadline: req.body.task_deadline,
    task_status_percentage: req.body.task_status_percentage,
    task_problem: req.body.task_problem,
    task_solution: req.body.task_solution
  };

  if (isNaN(newTask.task_status_percentage)) {
    return res.status(400).json({ error: 'Task status percentage must be a valid number' });
  }

  knex("projects")
    .where({ id: newTask.project_id })
    .then((projectsFound) => {
      if (projectsFound.length === 0) {
        return res.status(404).json({
          message: `Project ID: ${newTask.project_id} within task does not exist`,
        });
      }

      // Fetch the project details to compare deadlines
      const project = projectsFound[0];

      if (newTask.task_deadline > project.project_deadline) {
        return res.status(400).json({
          message: "Task deadline cannot be older than project deadline",
        });
      }

      knex("tasks")
        .insert(newTask)
        .then(() => {
          return knex("tasks")
            .where({
              project_id: newTask.project_id,
              task_name: newTask.task_name,
            })
            .select(
              "id",
              "project_id",
              "task_name",
              "task_description",
              "task_start_date",
              "task_deadline",
              "task_status_percentage",
              "task_problem",
              "task_solution"
            );
        })
        .then((createdTask) => {
          res.status(201).json(createdTask[0]);
        })
        .catch(() => {
          res.status(500).json({
            message: `Unable to create new task`,
          });
        });
    });
};

module.exports = {
  index,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};