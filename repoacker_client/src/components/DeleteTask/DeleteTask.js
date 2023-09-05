import React, { useState } from "react";
import axios from "axios";
import { urlTaskById } from "../../utils/api-utils";
import "./DeleteTask.scss";
import DeleteIcon from "../../assets/Icons/delete_outline-24px.svg";
import Modal from "react-modal";

function DeleteTask({ taskId, onDelete }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(urlTaskById(taskId));
      onDelete(); // Trigger the onDelete callback to update the task list
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      setShowConfirmation(false);
    }
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

export default DeleteTask;