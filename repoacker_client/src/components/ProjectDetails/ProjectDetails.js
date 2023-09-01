import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { urlProjectById, urlProjectTasks } from "../../utils/api-utils";
import "./ProjectDetails.scss";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from "recharts";

export default function ProjectDetails({ projectId }) {
  // const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const calculateRemainingDays = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  useEffect(() => {
    fetchProjectData();
    fetchProjectTasks();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get(urlProjectById(projectId));
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const fetchProjectTasks = async () => {
    try {
      const response = await axios.get(urlProjectTasks(projectId));
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
    }
  };

  const COLORS = ["#158463", "#BDC5D5"];
  const RADIAN = Math.PI / 180;

  const renderPieChart = () => {
    if (!project) return null;

    const data = [
      { name: "Project Percentage", value: parseFloat(project.project_status_percentage) },
      { name: "Remaining", value: 100 - parseFloat(project.project_status_percentage) }
    ];

    const isStatusInProcessOrDrop = project.project_status === "in-process" || project.project_status === "drop";

    const COLORS = [isStatusInProcessOrDrop ? "#158463" : "#158463", "#BDC5D5"];

    return (
      <div className="ProjectDetails__chart">
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
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
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


  const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderTaskChart = () => {
    if (!tasks.length) return null;

    const data = tasks.map(task => ({
      task_name: task.task_name,
      task_status_percentage: task.task_status_percentage
    }));

    const isAnyTaskInProcessOrDrop = tasks.some(task => task.task_status === "in-process" || task.task_status === "drop");

    const supportingColor = "#158463";

    return (
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
    );
  }



  return (
    <div className="ProjectDetails">
      <div className="ProjectDetails__info">
        <h2>{project ? project.project_name : "Loading..."}</h2>
        {project && (
          <p>
            Start Date: {project.project_start_date} | Deadline: {project.project_deadline} | Remaining Days: {calculateRemainingDays(project.project_deadline)}
          </p>
        )}
      </div>
      <div className="ProjectDetails__chart">
        <div className="ProjectDetails__chart-row">
          {renderPieChart()}
          {renderTaskChart()}
        </div>
      </div>
      <div className="ProjectDetails__tasks">
        <h3>Projects Details</h3>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <a>{task.task_name}</a>
              <p>Start Date: {task.task_start_date} | Deadline: {task.task_deadline}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}