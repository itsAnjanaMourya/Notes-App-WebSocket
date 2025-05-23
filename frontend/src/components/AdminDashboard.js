import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import userImage from '../assets/user.jpeg';
import AdminDashboardCSS from './AdminDashboard.css';
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const { isUserOnline } = useSocket();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchUsers();
            fetchAllTasks();
        }
    }, [currentUser]);

    const getAuthToken = () => {
        let token;
        document.cookie.split(";").forEach(cookie => {
            const [name, value] = cookie.trim().split("=");
            if (name === "access_token") {
                token = decodeURIComponent(value);
            }
        });
        return token;
    };

    const fetchUsers = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://localhost:3200/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again.');
        }
    };

    const fetchAllTasks = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://localhost:3200/admin/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Fetched tasks:', response.data);
            if (Array.isArray(response.data)) {
                setTasks(response.data);
                setError(null);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks. Please try again.');
        }
    };

    const fetchUserTasks = async (userId) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`http://localhost:3200/admin/tasks/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setTasks(response.data);
            setSelectedUser(userId);
            setError(null);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
            setError('Failed to fetch user tasks. Please try again.');
        }
    };

    if (error) {
        return (
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="dashboard-content">
                <div className="users-section">
                    <h2>Users</h2>
                    <div className="users-list">
                        {users.map(user => (
                            <div 
                                key={user._id} 
                                className={`user-item ${selectedUser === user._id ? 'selected' : ''}`}
                                onClick={() => fetchUserTasks(user._id)}
                            >
                                <div className="user-info">
                                    <div className="user-avatar">
                                        <img 
                                            src={userImage} 
                                            alt={user.username} 
                                            className="user-image"
                                        />
                                        <span className={`status-dot ${isUserOnline(user._id) ? 'online' : 'offline'}`}></span>
                                    </div>
                                    <div className="user-details">
                                        <span className="username">{user.username}</span>
                                        <span className="email">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tasks-section">
                    <h2>Tasks</h2>
                    <div className="tasks-list">
                        {tasks.map(task => (
                            <div key={task._id} className="task-item">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p>{task.description}</p>
                                <div className="task-meta">
                                    <span className={`priority ${task.priority.toLowerCase()}`}>
                                        Priority: {task.priority}
                                    </span>
                                    <span className="assigned-to">
                                        <img 
                                            src={userImage} 
                                            alt={task.user.username} 
                                            className="user-image-small"
                                        />
                                        {task.user.username}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 