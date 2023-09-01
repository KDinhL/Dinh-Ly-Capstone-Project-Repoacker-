import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { urlProjectTasks, urlAllProjects } from "../../utils/api-utils";
import "./TaskList.scss";

export default function TaskList() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Initialize with an empty string
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks();
    } else {
      setTasks([]); // Reset tasks when no project is selected
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

  const fetchTasks = async () => {
    try {
      const url = urlProjectTasks(selectedProjectId);
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    setSelectedProjectId(selectedProjectId);
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