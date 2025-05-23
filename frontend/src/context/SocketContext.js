import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Map());

    useEffect(() => {
        const newSocket = io('http://localhost:3200', {
            withCredentials: true
        });

        setSocket(newSocket);

        newSocket.on('userStatusChange', ({ userId, status }) => {
            setOnlineUsers(prev => {
                const newMap = new Map(prev);
                newMap.set(userId, status);
                return newMap;
            });
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const loginUser = (userId) => {
        if (socket) {
            socket.emit('userLogin', userId);
        }
    };

    const logoutUser = (userId) => {
        if (socket) {
            socket.emit('userLogout', userId);
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.get(userId) === 'online';
    };

    return (
        <SocketContext.Provider value={{ socket, loginUser, logoutUser, isUserOnline }}>
            {children}
        </SocketContext.Provider>
    );
}; 