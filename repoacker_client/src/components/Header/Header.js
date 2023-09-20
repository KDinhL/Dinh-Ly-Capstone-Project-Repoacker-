import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Logo from "../../assets/logo/logo.png";
import User from "../../assets/images/user.png";

export default function Header() {
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
                <p>User Name</p>
                <img src={User} alt="User Icon" className="header__user-icon--image" />

            </div>

        </header>
    );
}