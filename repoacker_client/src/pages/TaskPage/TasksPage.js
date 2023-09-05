import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TaskList from "../../components/TaskList/TaskList";
import "./TasksPage.scss";
import AddTask from "../../components/AddTask/AddTask";
import Modal from "react-modal";
import { urlProjectTasks } from "../../utils/api-utils";
import axios from "axios";

Modal.setAppElement("#root");

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const openModal = () => {
    if (!selectedProject) {
      alert("You need to select a project first.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProjectSelection = async (project) => {
    setSelectedProject(project);
    console.log("Selected Project in TasksPage:", project);

    if (project) {
      const { project_name, project_id, project_start_date, project_deadline } = project;
      console.log("Project Name:", project_name);
      console.log("Project ID:", project_id);
      console.log("Project Start Date:", project_start_date);
      console.log("Project Deadline:", project_deadline);

    }
  };

  const handleTaskAdded = async (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  
    // Refresh the task list by fetching tasks again
    if (selectedProject) {
      try {
        const response = await axios.get(urlProjectTasks(selectedProject.project_id));
        const updatedTasks = response.data;
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-page__column-PL">
        <TaskList
          onProjectSelect={handleProjectSelection}
          onTaskAdded={handleTaskAdded}
          tasks={tasks}
          setTasks={setTasks}
          task_project_name={selectedProject ? selectedProject.project_name : ""}
          project_start_date={selectedProject ? selectedProject.project_start_date : ""}
          project_deadline={selectedProject ? selectedProject.project_deadline : ""}
        />
      </div>
      <button className="add-task-button" onClick={openModal}>
          Add Task
        </button>
      <div className="tasks-page__column-TD">
       
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Task Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <AddTask
            closeModal={closeModal}
            project_id={selectedProject ? selectedProject.project_id : ""}
            task_project_name={selectedProject ? selectedProject.project_name : ""}
            project_start_date={selectedProject ? selectedProject.project_start_date : ""}
            project_deadline={selectedProject ? selectedProject.project_deadline : ""}
            onTaskAdded={handleTaskAdded}
            />
        </Modal>
        <Outlet />
      </div>
    </div>
  );
}