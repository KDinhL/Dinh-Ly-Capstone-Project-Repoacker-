import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  urlProjectTasks,
  urlAllProjects,
  urlProjectById,
  urlTaskById,
} from "../../utils/api-utils"; import "./TaskList.scss";
import DeleteTask from "../DeleteTask/DeleteTask"; // Import the DeleteTask component
import EditTask from "../EditTask/EditTask"; // Import the EditTask component

export default function TaskList({ project_deadline ,project_start_date ,onEdit, onProjectSelect, tasks, setTasks }) {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    } else {
      setTasks([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const url = urlAllProjects();
      const response = await axios.get(url);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const url = urlProjectTasks(projectId);
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleProjectChange = async (event) => {
    const selectedProjectId = event.target.value;
    setSelectedProjectId(selectedProjectId);

    let project_name, project_id, project_start_date, project_deadline;

    if (selectedProjectId) {
      try {
        const response = await fetch(urlProjectById(selectedProjectId));
        if (response.ok) {
          const data = await response.json();
          project_name = data.project_name;
          project_id = data.id;
          project_start_date = data.project_start_date;
          project_deadline = data.project_deadline;
        } else {
          console.error("Error fetching project details");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }

    onProjectSelect({ project_name, project_id, project_start_date, project_deadline });
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(urlTaskById(taskId));
      // Remove the deleted task from the tasks state
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId));

    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleProjectEdit = async () => {
    try {
      await fetchProjects(); // Fetch the updated project list
      if (selectedProjectId) {
        await fetchTasks(selectedProjectId);
      }
      onEdit(); // Call the callback function to trigger any necessary updates
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  return (
    <div className="TL">
      <h2>Task List</h2>
      <div>
        <label htmlFor="projectSelect">Select Project: </label>
        <select
          id="projectSelect"
          value={selectedProjectId}
          onChange={handleProjectChange}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>
      {selectedProjectId && tasks.length > 0 ? (
        <table className="TL__task-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Description</th>
              <th>Start Date</th>
              <th>Deadline</th>
              <th>Remaining Days</th>
              <th>Percentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>
                  <Link to={`/tasks/${task.id}`}>{task.task_description}</Link>
                </td>
                <td>{task.task_start_date}</td>
                <td>{task.task_deadline}</td>
                <td>
                  {task.remaining_days < 0 ? (
                    <span>Over Due</span>
                  ) : (
                    <span>{task.remaining_days}</span>
                  )}
                </td>
                <td>{task.task_status_percentage}%</td>
                <td>
                  <DeleteTask
                    taskId={task.id}
                    onDelete={() => handleTaskDelete(task.id)}
                  />
                  <EditTask
                    taskId={task.id}
                    projectId={selectedProjectId}
                    onEdit={handleProjectEdit}
                    project_start_date={project_start_date}
                    project_deadline={project_deadline}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks to display.</p>
      )}
    </div>
  );
}