import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { urlProjectTasks, urlAllProjects, urlProjectById } from "../../utils/api-utils";
import "./TaskList.scss";

export default function TaskList({ onProjectSelect, onTaskAdded, tasks, setTasks  }) {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  // const [tasks, setTasks] = useState([]);

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
      // Make an API call to get project_name using project.project_id
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