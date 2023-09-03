import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ProjectList from "../../components/ProjectList/ProjectList";
import "./ProjectsPage.scss";
import AddProject from "../../components/AddProject/AddProject";
import axios from "axios";
import { urlAllProjects } from "../../utils/api-utils";
import Modal from "react-modal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [keyForList, setKeyForList] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const url = urlAllProjects();
      const response = await axios.get(url);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const addProjectToList = (newProject) => {
    setProjects([...projects, newProject]);
    setKeyForList(keyForList + 1); 
    closeModal(); 
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="project-page">
      <div className="project-page__column-PL">
        <ProjectList projects={projects} key={keyForList} />
      </div>
      <div className="project-page__add-button">
        <button onClick={openModal}>Add Project</button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Project Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AddProject onProjectAdded={addProjectToList} closeModal={closeModal} />
      </Modal>
      <div>
        {/* Rest of the content */}
      </div>
      <div className="project-page__column-P">
        <Outlet />
      </div>
    </div>
  );
}