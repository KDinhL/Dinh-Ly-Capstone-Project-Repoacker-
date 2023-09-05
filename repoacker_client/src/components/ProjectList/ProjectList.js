import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { urlAllProjects } from "../../utils/api-utils";
import "./ProjectList.scss";
import DeleteProject from "../DeleteProject/DeleteProject";
import "../DeleteProject/DeleteProject.scss";
import EditProject from "../EditPoject/EditProject";
export default function ProjectList({ onProjectClick }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const url = urlAllProjects();
      const response = await axios.get(url);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectDelete = () => {
    fetchProjects();
  };
  const handleProjectEdit = () => {
    fetchProjects();
  };

   


  return (
    <div className="PL">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>
                <Link to={`/projects/${project.project_id}`}>
                  {project.project_name}
                </Link>
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
              <td>
                {project.remaining_days < 0 ? "Over Due" : project.remaining_days}
              </td>
              <td>
                {isNaN(Number(project.project_status_percentage))
                  ? project.project_status_percentage
                  : `${project.project_status_percentage}%`}
              </td>
              <td>
                <DeleteProject
                  projectId={project.project_id}
                  onDelete={handleProjectDelete}
                />
                <EditProject
                  projectId={project.project_id}
                  onEdit={handleProjectEdit}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  );
}