import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./TaskDetails.scss";

export default function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  return (
    <div className="TaskDetails">
      {task && (
        <div className="TaskDetails__content">
          <div className="TaskDetails__row">
            <h1>Task Name</h1>
            <input type="text" value={task.task_name} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Task N.O</h1>
            <input type="text" value={task.id} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Status</h1>
            <input
              type="text"
              value={`${task.task_status_percentage}%`}
              readOnly
            />
          </div>
          <div className="TaskDetails__row">
            <h1>Project</h1>
            <input type="text" value={task.project_name} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Description</h1>
            <textarea value={task.task_description} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Start Date</h1>
            <input type="text" value={task.task_start_date} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Deadline</h1>
            <input type="text" value={task.task_deadline} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Problems</h1>
            <textarea value={task.task_problem} readOnly />
          </div>
          <div className="TaskDetails__row">
            <h1>Solutions</h1>
            <textarea value={task.task_solution} readOnly />
          </div>
        </div>
      )}
    </div>
  );
}