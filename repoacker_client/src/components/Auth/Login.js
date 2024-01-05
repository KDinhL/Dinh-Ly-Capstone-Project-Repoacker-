import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import './Login.scss';
import { urlUserExistsResponse } from "../../utils/api-utils";
import { urlSignUp } from "../../utils/api-utils";
import { urlLogin } from "../../utils/api-utils";

Modal.setAppElement('#root');

const Login = ({ history }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isAboutAppModalOpen, setAboutAppModalOpen] = useState(false);

    const openAboutAppModal = () => {
        setAboutAppModalOpen(true);
    };

    const closeAboutAppModal = () => {
        setAboutAppModalOpen(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [signupData, setSignupData] = useState({
        email: '',
        newUsername: '',
        newPassword: '',
        repeatPassword: '',
        error: '',
    });

    const [error, setError] = useState('');

    const handleSignUp = async () => {
        try {
            const { email, newUsername, newPassword, repeatPassword } = signupData;

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setSignupData({ ...signupData, error: 'Invalid email format.' });
                return;
            }

            // Check if username or email already exists
            const userExistsResponse = await axios.post(urlUserExistsResponse, {
                username: newUsername,
                email: email,
            });

            if (userExistsResponse.data.exists) {
                setSignupData({ ...signupData, error: 'Username or email already exists.' });
                return;
            }

            // Additional error handling for other scenarios
            if (!newUsername || !newPassword || !repeatPassword) {
                setSignupData({ ...signupData, error: 'Please fill in all fields.' });
            } else if (newPassword !== repeatPassword) {
                setSignupData({ ...signupData, error: 'Passwords do not match.' });
            } else {
                // Send signup data to the server
                const response = await axios.post(urlSignUp, {
                    username: newUsername,
                    password: newPassword,
                    email: email,
                });

                // Assuming the server responds with the newly created user data
                const newUser = response.data.user;

                // Close the signup modal
                setShowSignUpModal(false);
            }
        } catch (error) {
            console.error(error);
            // Handle other errors as needed
        }
    };

    const handleLogin = async () => {
        try {
            if (username.trim() === '' || password.trim() === '') {
                setError('Please enter both username and password.');
            } else {
                setError('');

                const response = await axios.post(urlLogin, {
                    username: username,
                    password: password,
                });

                const { message, user } = response.data;

                if (message === 'Login successful') {
                    console.log('Logged in successfully:', user);

                    // Simulating a successful login
                    const loggedInUsername = username;

                    // Save the username in local storage
                    localStorage.setItem('loggedInUsername', loggedInUsername);

                    window.location.href = '/main';
                } else {
                    setError(message);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password.');
            } else {
                console.error('Unexpected error during login:', error);
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}

            />
            {error && <p className="error">{error}</p>}
            <Link to="#" onClick={(e) => {
                if (error) {
                    e.preventDefault();
                    console.log('Error during login. Cannot proceed to next page.');
                } else {
                    // No error, proceed with the link
                }
            }}>
                <button onClick={handleLogin}>Log In</button>
            </Link>

            <p>
                Don't have an account?{' '}
                <span onClick={() => setShowSignUpModal(true)}>Sign Up</span>
            </p>

            <Modal
                isOpen={showSignUpModal}
                onRequestClose={() => setShowSignUpModal(false)}
                className="modal-content-login"
                overlayClassName="modal-overlay-login"
            >
                <h2>Sign Up</h2>
                {signupData.error && <p className="error">{signupData.error}</p>}
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={signupData.newUsername}
                    onChange={(e) => setSignupData({ ...signupData, newUsername: e.target.value })}
                />
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={signupData.newPassword}
                    onChange={(e) => setSignupData({ ...signupData, newPassword: e.target.value })}
                />
                <label>Repeat Password</label>
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={signupData.repeatPassword}
                    onChange={(e) => setSignupData({ ...signupData, repeatPassword: e.target.value })}
                />
                <button onClick={handleSignUp}>Sign Up</button>
                <button onClick={() => setShowSignUpModal(false)}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Login;