import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlProjectById } from "../../utils/api-utils";
import "./EditProject.scss";
import Modal from "react-modal";
import EditIcon from "../../assets/Icons/edit-24px.svg"; // Import the edit icon

export default function EditProject({ projectId, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState({
    project_name: "",
    project_description: "",
    project_start_date: "",
    project_deadline: "",
  });

  // State to track input validity and error messages
  const [inputValidity, setInputValidity] = useState({
    project_name: true,
    project_description: true,
    project_start_date: true,
    project_deadline: true,
  });

  useEffect(() => {
    if (isEditing) {
      axios
        .get(urlProjectById(projectId))
        .then((response) => {
          const project = response.data;
          setProjectData({
            project_name: project.project_name,
            project_description: project.project_description,
            project_start_date: project.project_start_date,
            project_deadline: project.project_deadline,
          });
        })
        .catch((error) => {
          console.error("Error fetching project for editing:", error);
        });
    }
  }, [isEditing, projectId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate form fields
    let formValid = true;
    const newInputValidity = { ...inputValidity };

    for (const key in projectData) {
      if (projectData[key] === "") {
        formValid = false;
        newInputValidity[key] = false;
      }
    }

    setInputValidity(newInputValidity);

    if (!formValid) {
      return; // Don't proceed if there are validation errors
    }

    axios
      .put(urlProjectById(projectId), projectData)
      .then((response) => {
        console.log("Project updated:", response.data);
        setIsEditing(false);
        onEdit();
      })
      .catch((error) => {
        console.error("Error updating project:", error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData({ ...projectData, [name]: value });

    // Reset input validity when the user makes changes
    setInputValidity({ ...inputValidity, [name]: true });
  };

  return (
    <div>
      {isEditing ? (
        <Modal
          isOpen={isEditing}
          onRequestClose={handleCancelClick}
          contentLabel="Edit Project Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >    <div className="edit-project">

          <h2>Edit Project</h2>
          <form onSubmit={handleSaveClick}>
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
            </div>
            <div className="button-group">
              <button type="submit">Save Edit Project</button>
              <button type="button" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          </form>
          </div>
        </Modal>
      ) : (
        <button className="edit-button" onClick={handleEditClick}>
          <img src={EditIcon} alt="Edit Icon" />
        </button>
      )}
    </div>
  );
}