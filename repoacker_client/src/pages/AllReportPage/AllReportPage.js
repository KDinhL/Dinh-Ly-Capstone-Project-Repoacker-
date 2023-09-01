import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlAllProjects, urlProjectTasks } from "../../utils/api-utils";
import "./AllReportPage.scss";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from "recharts";

export default function AllReportPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(urlAllProjects());
      const projectData = response.data;

      // Fetch project tasks for each project
      const projectsWithTasks = await Promise.all(
        projectData.map(async (project) => {
          const tasksResponse = await axios.get(urlProjectTasks(project.project_id));
          return { ...project, tasks: tasksResponse.data };
        })
      );

      setProjects(projectsWithTasks);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };


  const renderPieChart = (project) => {
    if (!project) return null;

    const data = [
      { name: "Project Percentage", value: parseFloat(project.project_status_percentage) },
      { name: "Remaining", value: 100 - parseFloat(project.project_status_percentage) }
    ];

    const isStatusInProcessOrDrop = project.project_status === "in-process" || project.project_status === "drop";

    const projectColors = [isStatusInProcessOrDrop ? "#158463" : "#158463", "#BDC5D5"];

    return (
      <div className="project-pie-chart">
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={projectColors[index]} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="chart-label">
              {`${data[0].value.toFixed(0)}%`}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTaskChart = (project) => {
    if (!project || !project.tasks.length) return null;

    const data = project.tasks.map(task => ({
      task_name: task.task_name,
      task_status_percentage: task.task_status_percentage
    }));


    const supportingColor = "#158463"; // Define the supporting color directly here

    return (
      <div className="project-task-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="task_name" />
            <YAxis domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="task_status_percentage" fill={supportingColor}>
              <Label
                position="top"
                content={({ x, y, width, value }) => (
                  <text x={x + width / 2} y={y} fill="#333" textAnchor="middle" dy={-6}>
                    {`${value}%`}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderProjectList = () => {
    return (
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.project_id}>
            <h2>{project.project_name}</h2>
            {renderPieChart(project)}
            {renderTaskChart(project)}
            <ProjectTasks projectId={project.project_id} /> {/* Including ProjectTasks component */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="all-report-page">
      <h1>All Projects</h1>
      {renderProjectList()}
    </div>
  );
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