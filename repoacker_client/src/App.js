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
import AllReportPage from "./pages/AllReportPage/AllReportPage";
import AddProject from "./components/AddProject/AddProject";
import EditProject from "./components/EditPoject/EditProject";
import AddTask from "./components/AddTask/AddTask";
import Footer from "./components/Footer/Footer"
import Login from "./components/Auth/Login"
import Calendar from "./components/Calendar/Calendar";
function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/projects" element={<ProjectsPage />}>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="add" element={<AddProject />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />
        </Route>

        <Route path="/tasks" element={<TasksPage />}>
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
          <Route path="add" element={<AddTask />} />
        </Route>

        <Route path="/calendar" element={<Calendar />} />


        <Route path="/single-report/:projectId" element={<SingleReportPage />} />
        <Route path="/all-report" element={<AllReportPage />}>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;