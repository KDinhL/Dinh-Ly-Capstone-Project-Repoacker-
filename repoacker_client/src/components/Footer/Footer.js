import React, { useState } from "react";
import "./Footer.scss";
import Modal from "react-modal";

export default function Footer() {
  const [isAboutAppModalOpen, setAboutAppModalOpen] = useState(false);

  const openAboutAppModal = () => {
    setAboutAppModalOpen(true);
  };

  const closeAboutAppModal = () => {
    setAboutAppModalOpen(false);
  };

  return (
    <footer className="footer">
      <div className="footer__about-app-link" onClick={openAboutAppModal}>
        About App
      </div>
      <Modal
        isOpen={isAboutAppModalOpen}
        onRequestClose={closeAboutAppModal}
        contentLabel="About App Modal"
        className="footer-modal" 
      >
        <span className="close" onClick={closeAboutAppModal}>
          &times;
        </span>
        <div className="footer-modal-content"> 
        <h1>Repoacker: Revolutionizing Project and Task Management</h1>

<h2>Overview:</h2>
<p>Repoacker is an innovative web-based application meticulously crafted to transform the landscape of project and task management. Tailored to meet the intricate needs of software development teams and project managers, Repoacker stands as a centralized hub for streamlined project orchestration, task allocation, progress monitoring, and insightful reporting.</p>

<h2>Purpose:</h2>
<p>The core purpose of Repoacker is to simplify the complex process of managing software development projects and tasks. It facilitates collaboration, enhances efficiency, and promotes data-driven decision-making. Repoacker enables users to tackle the following key aspects of project management:</p>

<h3>Functionality:</h3>
<ul>
  <li><strong>Project Management:</strong> Repoacker serves as a comprehensive repository for project-related information. Users can effortlessly create, edit, and explore intricate project details. This feature fosters effective project planning and execution.</li>
  <li><strong>Task Management:</strong> Within each project, Repoacker empowers users to create, update, and monitor individual tasks. This capability enhances task allocation, fosters collaboration, and ensures project milestones are met.</li>
  <li><strong>Advanced Reporting:</strong> Repoacker's reporting capabilities are a standout feature. Users can generate detailed reports that offer deep insights into project progress, task completion rates, and other vital metrics. These reports serve as invaluable tools for project evaluation and decision-making.</li>
  <li><strong>User-Friendly Styling:</strong> Repoacker's interface is thoughtfully designed, incorporating custom styles and layouts. This user-friendly approach enhances the overall experience, encouraging users to engage with the platform seamlessly.</li>
</ul>

<h3>Libraries and Software Stack:</h3>
<p>On the Server-Side (API):</p>
<ul>
  <li><strong>Node.js:</strong> The backbone of the server-side operations, Node.js provides a runtime environment for building scalable and efficient server-side components.</li>
  <li><strong>Express.js:</strong> The server-side framework streamlines API development, simplifying routing, middleware management, and HTTP request/response handling.</li>
  <li><strong>mysql2:</strong> This MySQL database driver for Node.js enables efficient communication between the server and the MySQL database, ensuring robust data storage, retrieval, and management.</li>
  <li><strong>cors:</strong> Middleware for Express handles Cross-Origin Resource Sharing, allowing secure access to the API from diverse domains.</li>
  <li><strong>dotenv:</strong> The secure loading of environment variables via dotenv safeguards sensitive data such as database credentials.</li>
  <li><strong>morgan:</strong> Middleware for logging HTTP requests and responses aids in debugging and monitoring API interactions.</li>
  <li><strong>nodemon:</strong> A development dependency that automates server restarts upon code changes, streamlining the development workflow.</li>
</ul>

<p>On the Client-Side (Frontend):</p>
<ul>
  <li><strong>React:</strong> As the foundation, React empowers the frontend with dynamic, interactive components and streamlined state management.</li>
  <li><strong>react-dom:</strong> This package renders React components into the Document Object Model (DOM), making them visible in web browsers.</li>
  <li><strong>react-router-dom:</strong> Responsible for client-side routing, react-router-dom facilitates seamless navigation between different application pages without requiring full page reloads.</li>
  <li><strong>axios:</strong> A popular library for making HTTP requests from the frontend to interact with the server-side API, simplifying data fetching and sending.</li>
  <li><strong>sass:</strong> A CSS preprocessor enhances style organization and maintainability, contributing to a visually appealing user interface.</li>
  <li><strong>uuid:</strong> Utilized for generating universally unique identifiers (UUIDs), which are invaluable for creating unique keys for components or data records.</li>
  <li><strong>web-vitals:</strong> Measures web performance metrics to ensure the application runs efficiently and responsively.</li>
  <li><strong>@testing-library/jest-dom, @testing-library/react, and @testing-library/user-event:</strong> Components of the testing suite for React applications, simplifying the testing process of React components.</li>
  <li><strong>params:</strong> An additional package used in the project, with specific functionality defined by project requirements.</li>
</ul>

<p>Database Management (MySQL):</p>
<ul>
  <li><strong>Database Management:</strong> MySQL plays a pivotal role in Repoacker's data management, storing critical project, task, user, and other data, ensuring its persistence and accessibility.</li>
  <li><strong>Data Retrieval and Updates:</strong> MySQL enables the retrieval and modification of data, facilitating essential operations such as creating, editing, and deleting records.</li>
  <li><strong>Data Integrity:</strong> The database enforces data integrity constraints, ensuring the consistency and adherence to defined rules and relationships.</li>
</ul>

<p>Version Control and Collaboration (Git and GitHub):</p>
<ul>
  <li><strong>Git and GitHub:</strong> Git provides version control, allowing for the tracking of code changes and collaborative development. GitHub serves as a platform for hosting code repositories, facilitating collaboration among team members.</li>
</ul>

<h2>Conclusion:</h2>
<p>Repoacker is not just a project management tool; it is a transformative force. By harnessing the power of Node.js, Express.js, React, MySQL, Git, GitHub, and an array of supporting libraries and technologies, Repoacker empowers teams to conquer the complexities of software development projects. It fosters collaboration, enhances efficiency, and provides invaluable insights, making it an indispensable asset for modern project and task management.</p>
        </div>
      </Modal>
    </footer>
  );
}