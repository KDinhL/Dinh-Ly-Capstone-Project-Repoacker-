import React, { useState } from "react";
import axios from "axios";
import { urlProjectById } from "../../utils/api-utils";
import "./DeleteProject.scss";
import DeleteIcon from "../../assets/Icons/delete_outline-24px.svg";
import Modal from "react-modal";

function DeleteProject({ projectId, onDelete }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    axios
      .delete(urlProjectById(projectId))
      .then((response) => {
        if (response.status === 204) {

          onDelete();
          setShowConfirmation(false);
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        setShowConfirmation(false);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="delete-project">
      <button
        className="delete-project-button"
        onClick={() => setShowConfirmation(true)}
      >
        <img src={DeleteIcon} alt="Delete" />
      </button>

      <Modal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        className="modal"
        overlayClassName="modal-overlay-delete"
        ariaHideApp={false}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this project?</p>
        <div className="button-container">
          <button className="confirm-delete-button" onClick={handleDelete}>
            Yes, Delete
          </button>
          <button className="cancel-delete-button" onClick={handleCancelDelete}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default DeleteProject;