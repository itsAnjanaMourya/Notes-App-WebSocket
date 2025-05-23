import 'dotenv/config'
import connectDB from './config/db.js'
import express from 'express';
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/user.route.js';
import notesRouter from './routes/notes.route.js'
import adminRouter from './routes/admin.route.js'

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.BASE_URL,
        credentials: true
    }
});

// Store online users
const onlineUsers = new Map();

app.use(express.json())
const baseUrl = process.env.BASE_URL;
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}));

app.use("/user", userRouter)
app.use("/notes", notesRouter)
app.use("/admin", adminRouter)

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user login
    socket.on('userLogin', (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit('userStatusChange', {
            userId,
            status: 'online'
        });
    });

    // Handle user logout
    socket.on('userLogout', (userId) => {
        onlineUsers.delete(userId);
        io.emit('userStatusChange', {
            userId,
            status: 'offline'
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        let disconnectedUserId;
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }
        if (disconnectedUserId) {
            onlineUsers.delete(disconnectedUserId);
            io.emit('userStatusChange', {
                userId: disconnectedUserId,
                status: 'offline'
            });
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});

connectDB().then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on ${process.env.PORT}`);
    });
});
