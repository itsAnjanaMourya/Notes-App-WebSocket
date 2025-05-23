import { createContext, useContext, useState } from "react";
import axios from 'axios'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const login = async (input) => {
        console.log("Auth context login attempt with:", input.email);
        let token;
        document.cookie.split(";").map(s => { token = s.startsWith("access") ? s.substring("access_token=".length) : "" });
        try {
            const response = await axios.post(
                "http://localhost:3200/user/login",
                input,
                {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ``
                    }
                }
            );
            
            console.log("Login response:", response.data);
            const { token: newToken, user } = response.data;
            
            if (!user) {
                throw new Error("No user data in response");
            }

            document.cookie = `access_token=${newToken};`;
            setIsAuthenticated(true);
            setCurrentUser(user);
            
            return user;
        } catch (err) {
            console.error("Login error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            throw err;
        }
    };

    const logout = async () => {
        let token;
        document.cookie.split(";").map(s => { token = s.startsWith("access") ? s.substring("access_token=".length) : "" });
        try {
            // Then perform the actual logout
            const res = await axios.post("http://localhost:3200/user/logout",
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log("Logout response:", res.data);
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            setIsAuthenticated(false);
            setCurrentUser(null);
            window.location.href = "/";
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                isAuthenticated,
                currentUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);