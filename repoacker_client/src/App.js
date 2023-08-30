import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import Header from "./components/Header/Header";
import MainPage from "./components/MainPage/MainPage";
import ProjectList from './components/ProjectList/ProjectList';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import TaskList from './components/TaskList/TaskList';
import TaskDetails from './components/TaskDetails/TaskDetails';
import NotFound from './components/NotFound/NotFound';
import ProjectsPage from "./pages/ProjectPage/ProjectsPage";
import TasksPage from "./pages/TaskPage/TasksPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects" element={<ProjectsPage />}>
          <Route path=":projectId" element={<ProjectDetails />} />
        </Route>
        <Route path="/tasks" element={<TasksPage />} /> {/* Route to TaskList */}
        <Route path="/tasks/:taskId" element={<TaskDetails />} /> {/* Route to TaskDetail */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;