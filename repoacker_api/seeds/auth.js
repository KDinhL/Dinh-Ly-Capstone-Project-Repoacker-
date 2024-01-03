const authData = require('../seed-data/03_auth');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('auth_table').del()
        .then(function () {
            // Inserts seed entries
            return knex('auth_table').insert(authData.map(user => ({
                username: user.username,
                password: user.password,
                salt: user.salt,
                email: user.email,
            })));
        });
};