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

export const urlUserExistsResponse = (projectId) => {
  return `${url}/api/auth/signup/checkUserExists`;
};

export const urlSignUp = (projectId) => {
  return `${url}/api/auth/signup`;
};

export const urlLogin = (projectId) => {
  return `${url}/api/auth/login`;
};