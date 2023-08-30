import React from "react";
import { Outlet } from "react-router-dom";
import TaskList from "../../components/TaskList/TaskList";
import "./TasksPage.scss";

export default function TasksPage() {
  return (
    <div className="TasksPage">
      <div className="TasksPage__column-PL">
        <TaskList />
      </div>
      <div className="TasksPage__column-TD">
        <Outlet />
      </div>
    </div>
  );
}