import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Logo from "../../assets/logo/logo.png";
import User from "../../assets/images/user.png";

export default function Header() {
    // Retrieve the logged-in username from local storage
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    // Function to handle sign-out
    const handleSignOut = () => {
        // Clear the username from local storage
        localStorage.removeItem("loggedInUsername");

        // Redirect to the login page
        window.location.href = "/";
    };

    return (
        <header className="header">
            <div className="header__quote">
                <p>"Turning complexity into simplicity, where reporting has never been that easy."</p>
            </div>
            <div className="header__logo">
                <Link to="/main" className="header__logo-link">
                    <img className="header__logo-image" src={Logo} alt="Logo" />
                </Link>
            </div>
            <div className="header__user-icon">
                <p>{loggedInUsername || "User Name"}</p>
                <img src={User} alt="User Icon" className="header__user-icon--image" />
                {loggedInUsername && (
                    <button className="header__sign-out-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                )}
            </div>
        </header>
    );
}