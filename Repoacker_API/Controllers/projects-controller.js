const knex = require("knex")(require("../knexfile"));
const express = require('express');
const router = express.Router();

const index = async (req, res) => {
  try {
    const projects = await knex("projects").select("*");
    const projectData = [];

    for (const project of projects) {
      const tasks = await knex("tasks").where("project_id", project.id);
      const startDate = new Date(project.project_start_date);
      const deadline = new Date(project.project_deadline);
      const today = new Date();
      
      const remainingDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      if (remainingDays < 0) {
        project.remaining_days = "Over Due";
      }
      if (tasks.length === 0) {
        project.project_status_percentage = "in-process";
      } else {
        const totalTaskPercentage = tasks.reduce((sum, task) => sum + task.task_status_percentage, 0);
        const averageTaskPercentage = totalTaskPercentage / tasks.length;
        project.project_status_percentage = averageTaskPercentage.toString();
      }
      const projectInfo = {
        project_id: project.id,
        project_name: project.project_name,
        project_description: project.project_description,
        tasks_name: tasks.map(task => task.task_name),
        tasks_description: tasks.map(task => task.task_description),
        start_date: project.project_start_date,
        deadline: project.project_deadline,
        remaining_days: remainingDays,
        project_status_percentage: project.project_status_percentage
      };

      projectData.push(projectInfo);
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(400).send(`Error retrieving Projects: ${err}`);
  }
};

const getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await knex("projects").where({ id: projectId }).first();

    if (!project) {
      return res.status(400).json({
        message: "Project not found",
      });
    }

    const tasks = await knex("tasks").where("project_id", project.id);
    const startDate = new Date(project.project_start_date);
    const deadline = new Date(project.project_deadline);
    const today = new Date();

    const remainingDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      project.remaining_days = "Over Due";
    }
    if (tasks.length === 0) {
      project.project_status_percentage = "in-process";
    } else {
      const totalTaskPercentage = tasks.reduce((sum, task) => sum + task.task_status_percentage, 0);
      const averageTaskPercentage = totalTaskPercentage / tasks.length;
      project.project_status_percentage = averageTaskPercentage.toString();
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
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

const getProjectTasks = async (req, res) => {
  const projectId = req.params.id;

  try {
    const tasks = await knex("tasks")
      .select(
        "tasks.id",
        "tasks.task_name",
        "tasks.task_description",
        "tasks.task_start_date",
        "tasks.task_deadline",
        "tasks.task_status_percentage",
        "tasks.task_problem",
        "tasks.task_solution",
        "projects.project_name" // Include project_name from projects table
      )
      .join("projects", "tasks.project_id", "=", "projects.id") // Join with 'projects' table
      .where("tasks.project_id", projectId);

    const tasksWithRemainingDays = await Promise.all(
      tasks.map(async (task) => {
        const today = new Date();
        const taskDeadline = new Date(task.task_deadline);
        const remaining_days = Math.ceil((taskDeadline - today) / (1000 * 60 * 60 * 24));
        return { ...task, remaining_days };
      })
    );

    res.status(200).json(tasksWithRemainingDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while fetching tasks for project with ID: ${projectId}`,
    });
  }
};

module.exports = {
  index,
  getProjectById,
  updateProjectDetails,
  createProject,
  getProjectTasks,
  deleteProject,
};