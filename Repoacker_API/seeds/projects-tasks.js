const tasksData = require('../seed-data/02_tasks');
const projectsData = require('../seed-data/01_projects');

exports.seed = function (knex) {
  return knex('tasks').del()
    .then(function () {
      return knex('projects').del();
    })
    .then(function () {
      return knex('projects').insert(projectsData);
    })
    .then(() => {
      return knex('tasks').insert(tasksData);
    });
};