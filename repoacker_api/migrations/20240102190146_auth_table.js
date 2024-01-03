exports.up = function (knex) {
  return knex.schema.createTable('auth_table', function (table) {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('salt').nullable(); // Make 'salt' nullable
    table.string('email').notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('auth_table');
};