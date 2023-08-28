// const REACT_APP_BASE_URL = "http://localhost:8080";
const url = process.env.REACT_APP_BASE_URL
export const urlAllProjects = () => {
  return `${url}/api/projects`;
};

export const urlProjectById = (id) => {
  return `${url}/api/projects/${id}`;
};

export const urlAllTasks = () => {
  return `${url}/api/tasks`;
};

export const urlTaskById = (id) => {
  return `${url}/api/tasks/${id}`;
};

export const urlProjectTasks = (projectId) => {
  return `${url}/api/projects/${projectId}/tasks`;
};


