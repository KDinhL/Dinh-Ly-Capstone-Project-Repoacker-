import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import TaskDetails from './components/TaskDetails/TaskDetails';
import NotFound from './components/NotFound/NotFound';
import ProjectsPage from "./pages/ProjectPage/ProjectsPage";
import TasksPage from "./pages/TaskPage/TasksPage";
import SingleReportPage from "./pages/SingleReportPage/SingleReportPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects" element={<ProjectsPage />}>
          <Route path=":projectId" element={<ProjectDetails />} />
        </Route>
        <Route path="/tasks" element={<TasksPage />}>
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
        </Route>
        <Route path="/single-report/:projectId" element={<SingleReportPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;