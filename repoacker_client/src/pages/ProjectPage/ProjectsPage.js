import React from "react";
import { Outlet } from "react-router-dom";
import ProjectList from "../../components/ProjectList/ProjectList";
import "./ProjectsPage.scss";

export default function ProjectsPage() {
  return (
    <div className="ProjectPage">
      <div className="ProjectPage__column-PL"> 
        <ProjectList />
      </div>
      <div className="ProjectPage__column-P">
        <Outlet />
      </div>
    </div>
  );
}