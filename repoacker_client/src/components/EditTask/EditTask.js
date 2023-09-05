import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlTaskById } from "../../utils/api-utils";
import "./EditTask.scss";
import Modal from "react-modal";
import EditIcon from "../../assets/Icons/edit-24px.svg";

export default function EditTask({ taskId, projectId, onEdit, project_start_date, project_deadline }) {

    const [isEditing, setIsEditing] = useState(false);
    const [taskData, setTaskData] = useState({
        task_name: "",
        task_description: "",
        task_start_date: "",
        task_deadline: "",
        task_status_percentage: "",
        task_problem: "",
        task_solution: "",
    });

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
    const [percentageError, setPercentageError] = useState(false);

    useEffect(() => {
        if (isEditing) {
            axios
                .get(urlTaskById(taskId))
                .then((response) => {
                    const task = response.data;
                    setTaskData({
                        project_id: projectId,
                        task_name: task.task_name,
                        task_description: task.task_description,
                        task_start_date: task.task_start_date,
                        task_deadline: task.task_deadline,
                        task_status_percentage: task.task_status_percentage,
                        task_problem: task.task_problem,
                        task_solution: task.task_solution,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching task for editing:", error);
                });
        }
    }, [isEditing, taskId, projectId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = (e) => {
        e.preventDefault();

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


        axios
            .put(urlTaskById(taskId), taskData)
            .then((response) => {
                setTaskData(response.data);
                setIsEditing(false);
                onEdit();
            })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTaskData({ ...taskData, [name]: value });
        setInputValidity({ ...inputValidity, [name]: true });
    };

    return (
        <div >
            {isEditing ? (
                <Modal
                    isOpen={isEditing}
                    onRequestClose={handleCancelClick}
                    contentLabel="Edit Task Modal"
                    className="edit-task"
                    overlayClassName="modal-overlay"
                ><div className="edit-task"
>
                    <section className="edit-task__header">
                        <h2>Edit Task</h2>
                        <div className="date-info">
                            <p>
                                Please select a date between {project_start_date} and{" "}
                                {project_deadline} for both Start Date and Deadline.
                            </p>
                        </div>
                    </section>
                    <form onSubmit={handleSaveClick}>
                        <section className="edit-task__user-form">
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
                                        <span className="error-message">Deadline must be later than the start date.</span>
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
                            <button type="submit">Save Edit Task</button>
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