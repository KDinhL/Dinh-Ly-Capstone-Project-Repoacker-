const express = require('express');
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const fs = require('fs');
const path = require('path');

const signup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists in the database
    const existingUser = await knex("auth_table")
      .where({ username: username, email: email })
      .first();

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }
 // Generate a random salt
 const generateRandomSalt = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const saltLength = 16; // You can adjust the length of the salt as needed
  let salt = '';

  for (let i = 0; i < saltLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    salt += characters.charAt(randomIndex);
  }

  return salt;
};
 const salt = generateRandomSalt();

    // Insert new user into the auth_table
    const newUser = {
      username: username,
      password: password, // In production, this should be a hashed password
      email: email,
      salt: salt,
    };
    await knex("auth_table").insert(newUser);

    // Retrieve the newly created user from the database
    const createdUser = await knex("auth_table")
      .where({ username: username })
      .first();

    // Update the seed data dynamically
    const seedFilePath = path.join(__dirname, '../seed-data/03_auth.js'); // Use .js extension
    const seedData = require(seedFilePath);
    seedData.push({
      id: seedData.length + 1,
      username: username,
      password: password, // In production, this should be a hashed password
      email: email,
      salt: salt, // Include the salt
    });

    // Write the updated seed data back to the file
    fs.writeFileSync(seedFilePath, `module.exports = ${JSON.stringify(seedData, null, 2)};`);

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
    });
  } catch (error) {
    next(`Error during signup: ${error}`);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Retrieve user from the database
    const user = await knex("auth_table")
      .where({ username: username })
      .first();

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // Implement additional login logic here if needed...

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(`Error during login: ${error}`);
  }
};

const getUser = async (req, res, next) => {
  try {
    // Retrieve user list from the auth_table in the database
    const users = await knex("auth_table").select("id", "username", "email");

    res.status(200).json(users);
  } catch (error) {
    next(`Error getting user details: ${error}`);
  }
};

const checkUserExists = async (req, res, next) => {
  try {
      const { username, email } = req.body;

      // Check if the user already exists in the database
      const existingUser = await knex("auth_table")
          .where({ username: username, email: email })
          .first();

      res.status(200).json({ exists: !!existingUser });
  } catch (error) {
      next(`Error checking user existence: ${error}`);
  }
};

module.exports = {
  signup,
  login,
  getUser,
  checkUserExists, 
};