import React, { useState } from "react";
import axios from "axios";
import { urlAllTasks } from "../../utils/api-utils";
import "./AddTask.scss";

function AddTask({ closeModal, project_id, task_project_name, project_start_date, project_deadline, onTaskAdded,setTasks  }) {
  const [taskData, setTaskData] = useState({
    task_name: "",
    task_description: "",
    task_start_date: "",
    task_deadline: "",
    task_status_percentage: "",
    task_problem: "",
    task_solution: "",
  });
  const [percentageError, setPercentageError] = useState(false);

  const [inputValidity, setInputValidity] = useState({
    task_name: true,
    task_description: true,
    task_start_date: true,
    task_deadline: true,
    task_status_percentage: true,
    task_problem: true,
    task_solution: true,
  });

  const [deadlineError, setDeadlineError] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name]: value });
    setInputValidity({ ...inputValidity, [name]: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    let formValid = true;
    const newInputValidity = { ...inputValidity };

    for (const key in taskData) {
      if (taskData[key] === "") {
        formValid = false;
        newInputValidity[key] = false;
      }
    }

    const taskStatusPercentage = parseFloat(taskData.task_status_percentage);
    if (isNaN(taskStatusPercentage) || taskStatusPercentage < 0 || taskStatusPercentage > 100) {
      formValid = false;
      newInputValidity["task_status_percentage"] = false;
      setPercentageError(true); 
    } else {
      setPercentageError(false); // Reset the percentage error flag if the value is valid
    }

    if (new Date(taskData.task_start_date) < new Date(project_start_date) ||
        new Date(taskData.task_start_date) >= new Date(taskData.task_deadline)) {
      formValid = false;
      newInputValidity["task_start_date"] = false;
      setDeadlineError(true);
    }

    if (new Date(taskData.task_deadline) > new Date(project_deadline) ||
        new Date(taskData.task_deadline) <= new Date(taskData.task_start_date)) {
      formValid = false;
      newInputValidity["task_deadline"] = false;
      setDeadlineError(true);
    }

    setInputValidity(newInputValidity);

    if (!formValid) {
      return;
    }

    // Submit the task data
    try {
      const response = await axios.post(urlAllTasks(), {
        ...taskData,
        project_id,
        task_project_name,
      });
      const newTask = response.data; // Assuming the response contains the newly created task
      console.log("Task created:", newTask);

      // Reset the form
      setTaskData({
        task_name: "",
        task_description: "",
        task_start_date: "",
        task_deadline: "",
        task_status_percentage: "",
        task_problem: "",
        task_solution: "",
      });

      // Close the modal
      closeModal();
      onTaskAdded(newTask);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle the error and display an error message
    }
  };

  return (
    <div className="add-task">
        <section className="add-task__header">
      <h2>Add New Task</h2>
      <div className="date-info">
      <p>
        Please select a date between {project_start_date} and{" "}
        {project_deadline} for both Start Date and Deadline.
      </p>
    </div>
    </section>
      <form onSubmit={handleSubmit}>
        <section className="add-task__user-form">
        <div className="left-column">
          <div className="input-group">
            <label htmlFor="task_name">Task Name</label>
            <input
              type="text"
              id="task_name"
              name="task_name"
              value={taskData.task_name}
              onChange={handleInputChange}
              className={inputValidity.task_name ? "" : "error"}
            />
            {!inputValidity.task_name && (
              <span className="error-message">This field is required.</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="task_description">Task Description</label>
            <textarea
              id="task_description"
              name="task_description"
              value={taskData.task_description}
              onChange={handleInputChange}
              className={inputValidity.task_description ? "" : "error"}
            ></textarea>
            {!inputValidity.task_description && (
              <span className="error-message">This field is required.</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="task_solution">Task Solution</label>
            <textarea
              id="task_solution"
              name="task_solution"
              value={taskData.task_solution}
              onChange={handleInputChange}
              className={inputValidity.task_solution ? "" : "error"}
            ></textarea>
            {!inputValidity.task_solution && (
              <span className="error-message">This field is required.</span>
            )}
          </div>
        </div>
 
        <div className="right-column">

          <div className="input-group">
            <label htmlFor="task_start_date">Start Date</label>
            <input
              type="date"
              id="task_start_date"
              name="task_start_date"
              value={taskData.task_start_date}
              onChange={handleInputChange}
              className={inputValidity.task_start_date ? "" : "error"}
            />
            {!inputValidity.task_start_date && (
              <span className="error-message">This field is required.</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="task_deadline">Deadline</label>
            <input
              type="date"
              id="task_deadline"
              name="task_deadline"
              value={taskData.task_deadline}
              onChange={handleInputChange}
              className={inputValidity.task_deadline ? "" : "error"}
            />
            {!inputValidity.task_deadline && (
              <span className="error-message">This field is required.</span>
            )}
            {deadlineError && (
              <span className="error-message">Invalid deadline date.</span>
            )}
          </div>
           <div className="input-group">
            <label htmlFor="task_status_percentage">Status Percentage</label>
            <input
              type="number"
              id="task_status_percentage"
              name="task_status_percentage"
              value={taskData.task_status_percentage}
              onChange={handleInputChange}
              className={inputValidity.task_status_percentage ? "" : "error"}
            />
            {!inputValidity.task_status_percentage && (
              <span className="error-message">This field is required.</span>
            )}
            {percentageError && (
              <span className="error-message">Please enter a number between 0 and 100.</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="task_problem">Task Problem</label>
            <textarea
              id="task_problem"
              name="task_problem"
              value={taskData.task_problem}
              onChange={handleInputChange}
              className={inputValidity.task_problem ? "" : "error"}
            ></textarea>
            {!inputValidity.task_problem && (
              <span className="error-message">This field is required.</span>
            )}
          </div>
        </div>
        </section>
        <div className="button-group">
          <button type="submit">Save Task</button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;