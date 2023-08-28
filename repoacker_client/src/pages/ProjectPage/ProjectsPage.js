import React from "react";
import ProjectList from "../../components/ProjectList/ProjectList";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";
import "./ProjectsPage.scss";

export default function ProjectPage() {
  return (
    <div className="ProjectPage">
      <div className="ProjectPage__column">
        <ProjectList />
      </div>
      <div className="ProjectPage__column">
        <ProjectDetails />
      </div>
    </div>
  );
}