const knex = require("knex")(require("../knexfile"));
const express = require('express');
const router = express.Router();

const index = (req, res) => {
  knex("projects")
    .select(
      "id",
      "project_name",
      "project_description",
      "project_start_date",
      "project_deadline",
      )
      .then(async (projects) => {
        for (const project of projects) {
          const tasks = await knex('tasks').where('project_id', project.id);
          if (tasks.length === 0) {
            project.project_status = 'in-process'; 
          } else {
            const totalTaskPercentage = tasks.reduce((sum, task) => sum + task.task_status_percentage, 0);
            const averageTaskPercentage = totalTaskPercentage / tasks.length;
            project.project_status = averageTaskPercentage.toString(); 
          }
        }
        res.status(200).json(projects);
      })
    .catch((err) =>
      res.status(400).send(`Error retrieving Projects: ${err}`)
    );
};

const getProjectById = (req, res) => {
  const projectId = req.params.id;
  knex("projects")
    .where({ id: projectId })
    .first()
    .then((project) => {
      if (!project) {
        return res.status(400).json({
          message: "Project not found",
        });
      }
      res.status(200).json(project);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching data" });
    });
};

const updateProjectDetails = (req, res) => {
  knex("projects")
    .where({ id: req.params.id })
    .update(req.body)
    .then((project) => {
      if (project === 0) {
        return res.status(404).json({ message: `No project found with ID: ${req.params.id}` });
      }
      return knex("projects").where({
        id: req.params.id,
      });
    })
    .then((updatedDetails) => {
      res.json(updatedDetails[0]);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: `Unable to update project with ID: ${req.params.id}` });
    });
};

const createProject = (req, res) => {
  const newProject = {
    project_name: req.body.project_name,
    project_description: req.body.project_description,
    project_start_date: req.body.project_start_date,
    project_deadline: req.body.project_deadline,
    project_status_percentage: req.body.project_status_percentage
  };

  knex('projects')
    .insert(newProject)
    .then(() => {
      return knex('projects').where({ project_name: newProject.project_name });
    })
    .then((createdProject) => {
      res.status(201).json(createdProject[0]);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Unable to create new project' });
    });
};

const deleteProject = (req, res) => {
  knex("projects")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (!result) {
        return res.status(400).json({
          message: `Delete request failed. Project with ID: ${req.params.id} is not found.`,
        });
      }
    })
    .then(() => {
      res.status(204).send(); // No content response
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete project" });
    });
};

const getProjectTasks = (req, res) => {
  const projectId = req.params.id;

  knex("tasks")
    .select(
      "tasks.id",
      "tasks.task_name",
      "tasks.task_description",
      "tasks.task_start_date",
      "tasks.task_deadline",
      "tasks.task_status_percentage",
      "tasks.task_problem",
      "tasks.task_solution"
    )
    .where("tasks.project_id", projectId)
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: `An error occurred while fetching tasks for project with ID: ${projectId}`,
      });
    });
};

module.exports = {
  index,
  getProjectById,
  updateProjectDetails,
  createProject,
  getProjectTasks,
  deleteProject,
};