
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { urlAllProjects } from "../../utils/api-utils";
import "./AddProject.scss";

function AddProject({ onProjectAdded, closeModal }) {
  const [projectData, setProjectData] = useState({
    project_name: "",
    project_description: "",
    project_start_date: "",
    project_deadline: "",
  });

  const [inputValidity, setInputValidity] = useState({
    project_name: true,
    project_description: true,
    project_start_date: true,
    project_deadline: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData({ ...projectData, [name]: value });
    setInputValidity({ ...inputValidity, [name]: true });
  };
  const [deadlineError, setDeadlineError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    let formValid = true;
    const newInputValidity = { ...inputValidity };

    for (const key in projectData) {
      if (projectData[key] === "") {
        formValid = false;
        newInputValidity[key] = false;
      }
    }

    if (new Date(projectData.project_deadline) < new Date(projectData.project_start_date)) {
      formValid = false;
      newInputValidity["project_deadline"] = false;
      setDeadlineError(true); // Set the error when the deadline is before start date
    }

    setInputValidity(newInputValidity);

    if (!formValid) {
      return;
    }

    // Submit the project data
    try {
      const response = await axios.post(urlAllProjects(), projectData);
      console.log("Project created:", response.data);

      // Call the callback function to add the new project to the list
      onProjectAdded(response.data);

      // Reset the form
      setProjectData({
        project_name: "",
        project_description: "",
        project_start_date: "",
        project_deadline: "",
      });

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error creating project:", error);
      // Handle the error and display an error message
    }
  };

  return (
    <div className="add-project">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="project_name">Project Name</label>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={projectData.project_name}
            onChange={handleInputChange}
            className={inputValidity.project_name ? "" : "error"}
          />
          {!inputValidity.project_name && (
            <span className="error-message">This field is required.</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="project_description">Project Description</label>
          <textarea
            id="project_description"
            name="project_description"
            value={projectData.project_description}
            onChange={handleInputChange}
            className={inputValidity.project_description ? "" : "error"}
          ></textarea>
          {!inputValidity.project_description && (
            <span className="error-message">This field is required.</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="project_start_date">Start Date</label>
          <input
            type="date"
            id="project_start_date"
            name="project_start_date"
            value={projectData.project_start_date}
            onChange={handleInputChange}
            className={inputValidity.project_start_date ? "" : "error"}
          />
          {!inputValidity.project_start_date && (
            <span className="error-message">This field is required.</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="project_deadline">Deadline</label>
          <input
            type="date"
            id="project_deadline"
            name="project_deadline"
            value={projectData.project_deadline}
            onChange={handleInputChange}
            className={inputValidity.project_deadline ? "" : "error"}
          />
          {!inputValidity.project_deadline && (
            <span className="error-message">This field is required.</span>
          )}
          {deadlineError && (
            <span className="error-message">Deadline cannot be before the start date.</span>
          )}
        </div>
        <div className="button-group">
          <button type="submit">Add Project</button>
        </div>
      </form>
    </div>
  );
}

export default AddProject;