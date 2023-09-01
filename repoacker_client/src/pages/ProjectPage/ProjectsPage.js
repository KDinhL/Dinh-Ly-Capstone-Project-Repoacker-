import React from "react";
import { Outlet } from "react-router-dom";
import ProjectList from "../../components/ProjectList/ProjectList";
import "./ProjectsPage.scss";

export default function ProjectsPage() {
  return (
    <div className="project-page">
      <div className="project-page__column-PL"> 
        <ProjectList />
      </div>
      <div className="project-page__column-P">
        <Outlet />
      </div>
    </div>
  );
}