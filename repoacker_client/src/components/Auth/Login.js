import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import "./Login.scss"; // Import your styles (ensure the path is correct)

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

    // State for signup form
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [signupData, setSignupData] = useState({
        email: '',
        newUsername: '',
        newPassword: '',
        repeatPassword: '',
        error: '',
    });
    const [error, setError] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const handleSignUp = () => {
        // Check if all fields are filled and passwords match
        if (!signupData.email || !signupData.newUsername || !signupData.newPassword || !signupData.repeatPassword) {
            setSignupData({ ...signupData, error: 'Please fill in all fields.' });
        } else if (signupData.newPassword !== signupData.repeatPassword) {
            setSignupData({ ...signupData, error: 'Passwords do not match.' });
        } else {
            // Perform signup logic here (e.g., create a new user)
            // For the demo, just close the modal
            setShowSignUpModal(false);
        }
    };
    const handleLogin = () => {
        // Check if username and password are empty
        if (username.trim() == '' || password.trim() == '') {
            setError('Please enter both username and password.');
        } else {
            setError(''); // Clear the error message
        }
    };


    
    return (
        <div className="login-container">
            <h2>Login</h2>
            {/* Input fields for login */}
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
            />
            {error && <p className="error">{error}</p>}
            {/* Link for navigation */}
            <Link to={username.trim() !== '' && password.trim() !== '' ? '/main' : '#'}>
                <button onClick={handleLogin}>Log In</button>
            </Link>

            <p>
                Don't have an account?{' '}
                <span onClick={() => setShowSignUpModal(true)}>Sign Up</span>
            </p>

            {/* Signup Modal */}
            <Modal
                isOpen={showSignUpModal}
                onRequestClose={() => setShowSignUpModal(false)}
                className="modal-content-login"
                overlayClassName="modal-overlay-login"
            >
                <h2>Sign Up</h2>
                {signupData.error && <p className="error">{signupData.error}</p>}
                {/* Input fields for signup */}
                <input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={signupData.newUsername}
                    onChange={(e) => setSignupData({ ...signupData, newUsername: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={signupData.newPassword}
                    onChange={(e) => setSignupData({ ...signupData, newPassword: e.target.value })}
                />
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