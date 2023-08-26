const express = require('express');
const router = express.Router();
const projectsController = require('../Controllers/projects-controller');

// Base Get Request is http://localhost:8080/api/projects + <insert route>
router.route('/').get(projectsController.index).post(projectsController.createProject);
router.route('/:id').get(projectsController.getProjectById).delete(projectsController.deleteProject).put(projectsController.updateProjectDetails);
router.route('/:id/tasks').get(projectsController.getProjectTasks);

module.exports = router;