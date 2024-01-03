const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.use(express.json());

const tasksRoutes = require('./routes/tasks');
const projectsRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');  

app.use("/api/projects", projectsRoutes)
app.use("/api/tasks" ,tasksRoutes);
app.use("/api/auth", authRoutes);  

app.use((err, req, res, next) => {
  console.error(err); // Log the error to the console
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});