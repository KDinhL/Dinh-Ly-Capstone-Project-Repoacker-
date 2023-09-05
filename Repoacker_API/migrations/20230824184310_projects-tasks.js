/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('project_name').notNullable();
      table.string('project_description').notNullable();
      table.string('project_start_date').notNullable();
      table.string('project_deadline').notNullable();
      table.integer('project_status_percentage').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
    .createTable('tasks', (table) => {
      table.increments('id').primary();
      table
        .integer('project_id')
        .unsigned()
        .references('projects.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table.string('task_name').notNullable();
        table.string('task_project_name').notNullable();
        table.string('task_description').notNullable();
        table.string('task_start_date').notNullable();
        table.string('task_deadline').notNullable();
        table.string('project_status').defaultTo('in-process');
        table.string('task_problem').notNullable();
        table.string('task_solution').notNullable();
        table.integer('task_status_percentage').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('tasks').dropTable('projects');
  };