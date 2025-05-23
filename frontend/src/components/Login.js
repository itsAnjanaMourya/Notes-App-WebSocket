import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const { loginUser } = useSocket();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let errors = { email: "", password: "" };

            if (!email) {
                errors.email = "Email is required.";
            }
            if (!password) {
                errors.password = "Password is required.";
            }
            if (errors.email || errors.password) {
                setError(errors);
                return;
            }
            setError({ email: "", password: "" });

            const user = await login({ email, password });
            console.log("Login successful, user data:", user);
            
            if (user && user._id) {
                loginUser(user._id);
                console.log("User role:", user.role);
                
                // Get the return path from location state or default to home
                const from = location.state?.from?.pathname || "/home";
                
                // Redirect based on user role and return path
                if (user.role === 'admin') {
                    console.log("Redirecting to admin dashboard");
                    navigate("/admin");
                } else {
                    console.log("Redirecting to:", from);
                    navigate(from);
                }
            } else {
                console.error("User data is incomplete:", user);
                navigate("/");
            }
            
        } catch (err) {
            console.error("Login error:", err);
            navigate("/");
        }
    }

    return (
        <>
            <div className="outer">
                <div className="LoginWrapper" id="login" >
                    <div className='inner'>
                        <h2 style={{ color: "white" }}>Login</h2>
                        <form onSubmit={handleSubmit} className="">
                            <label className="login-label">
                                Enter your email: </label>
                            <input
                                type="email"
                                name="email"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="error">{error.email && <p >{error.email}</p>}</div>
                            <br />
                            <label className="login-label">Enter your password:</label>
                            <input
                                type="password"
                                name="password"
                                className="login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="error">{error.password && <p>{error.password}</p>}</div>
                            <br />
                            <button type="submit" className="login-btn">
                                Login
                            </button>
                            <p className='form-footer'>
                                Don't have an Account?<Link className='custom-link' to="/register">Register here</Link>
                            </p>
                            <p>or login using guest credentials<br/>
                           (email: guest@gmail.com<br/>
                            password: 123)</p>
                            <p>For admin access:<br/>
                           (email: admin@admin.com<br/>
                            password: admin123)</p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
