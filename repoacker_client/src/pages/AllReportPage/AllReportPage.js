import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlAllProjects, urlProjectTasks, urlProjectById } from "../../utils/api-utils";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";
import "./AllReportPage.scss";

export default function AllReportPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(urlAllProjects());
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div className="all-report-page">
      <h1>All Projects</h1>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.project_id}>
            <ProjectDetailsLoader projectId={project.project_id} />
            <ProjectTasks projectId={project.project_id} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailsLoader({ projectId  }) {


  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    fetchProjectDetails(); 
  }, [projectId]);

  const fetchProjectDetails = async () => {
    const url = process.env.REACT_APP_BASE_URL;
    try {
      const response = await axios.get(urlProjectById(projectId ), {
        baseURL: url, 
      });
      setProjectDetails(response.data.id);

    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  if (!projectDetails) {
    return <p>Loading...</p>;
  }

  return <ProjectDetails projectId={projectDetails} />;
}

function ProjectTasks({ projectId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId]);

  const fetchProjectTasks = async () => {
    try {
      const response = await axios.get(urlProjectTasks(projectId));
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
    }
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      <table className="task-table">
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
              <td>{task.task_description}</td>
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
      {tasks.map((task) => (
        <div key={task.id} className="task-details">
        <h2>Task Details</h2>
        <div className="task-details-row">
          <h3>Task Name</h3>
          <input type="text" value={task.task_name} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Task N.O</h3>
          <input type="text" value={task.id || ""} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Status</h3>
          <input
            type="text"
            value={`${task.task_status_percentage}%`}
            readOnly
          />
        </div>
        
        <div className="task-details-row">
          <h3>Description</h3>
          <textarea value={task.task_description} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Start Date</h3>
          <input type="text" value={task.task_start_date} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Deadline</h3>
          <input type="text" value={task.task_deadline} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Problems</h3>
          <textarea value={task.task_problem} readOnly />
        </div>
        <div className="task-details-row">
          <h3>Solutions</h3>
          <textarea value={task.task_solution} readOnly />
        </div>
      </div>
      ))}
    </div>
  );
}