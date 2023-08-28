import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { urlAllProjects } from "../../utils/api-utils";
import "./ProjectList.scss";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const url = urlAllProjects();
      console.log("URL for fetching projects:", url);

      const response = await axios.get(url);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectClick = (projectId) => {
    console.log("Clicked project ID:", projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <div>
      <h2>Project List</h2>
      <table className="PL__project-table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Description</th>
            <th>Tasks ID</th>
            <th>Tasks Description</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Remaining Days</th>
            <th>Project Percentage</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>
                <a
                  href="#"
                  onClick={() => handleProjectClick(project.project_id)}
                >
                  {project.project_name}
                </a>
              </td>
              <td>{project.project_description}</td>
              <td>
                {project.tasks_name.map((taskName) => (
                  <span key={taskName}>{taskName}, </span>
                ))}
              </td>
              <td>
                {project.tasks_description.map((taskDesc) => (
                  <span key={taskDesc}>{taskDesc}, </span>
                ))}
              </td>
              <td>{project.start_date}</td>
              <td>{project.deadline}</td>
              <td>{project.remaining_days}</td>
              <td>{project.project_status_percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}