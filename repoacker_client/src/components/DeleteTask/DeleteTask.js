import React, { useState } from "react";
import axios from "axios";
import { urlTaskById } from "../../utils/api-utils";
import "./DeleteTask.scss";
import DeleteIcon from "../../assets/Icons/delete_outline-24px.svg";
import Modal from "react-modal";

function DeleteTask({ taskId, onDelete }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    axios
      .delete(urlTaskById(taskId))
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
    <div className="delete-task">
      <button
        className="delete-task-button"
        onClick={() => setShowConfirmation(true)}
      >
        <img src={DeleteIcon} alt="Delete" />
      </button>

      <Modal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this task?</p>
        <div className="button-container">
          <button className="confirm-delete-button" onClick={() => onDelete(taskId)}>
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

export default DeleteTask;