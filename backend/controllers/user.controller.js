import bcrypt from 'bcrypt'
import userModel from '../models/user.schema.js'
import jwt from 'jsonwebtoken'
import blacklist from '../middleware/blacklist.js'

const createAdmin = async () => {
    try {
        const guestUser = await userModel.findOne({ email: 'admin@admin.com' });
        if (!guestUser) {
            const hashedPassword = await bcrypt.hash('admin123', 5);
            const adminUser = new userModel({
                username: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Guest user created successfully');
        }
    } catch (error) {
        console.error('Error creating guest user:', error);
    }
};
createAdmin();

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, "username")
    console.log("post api test")
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log("error", err)
                res.status(500).send({ "msg": 'something is wrong' })
            } else {
                const RegisterUser = new userModel({ 
                    username: name, 
                    email, 
                    password: hash,
                    role: 'user' // All registered users are regular users
                })
                await RegisterUser.save()
                res.status(200).send({ 
                    'message': 'registration successful!', 
                    user: {
                        _id: RegisterUser._id,
                        username: RegisterUser.username,
                        email: RegisterUser.email,
                        role: RegisterUser.role
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).send({ error: 'user is not registered!' })
    }
}

export const login = async (req, res) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            console.log('Token:--', token);
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findById(decoded.id).select('-password');
            res.status(200).json({ 
                message: "You are Logged in by refresh!", 
                token: token, 
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            res.status(401).json({ message: "login again"})
        }
    }
    else {
        const { email, password } = req.body;
        console.log("Login  email:", email); 
        try {
            // Check if it's an admin login
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                console.log("Admin login detected"); 
                
                // Find or create admin user
                let adminUser = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
                if (!adminUser) {
                    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 5);
                    adminUser = await userModel.create({
                        username: 'Admin',
                        email: process.env.ADMIN_EMAIL,
                        password: hashedPassword,
                        role: 'admin'
                    });
                }
                
                const token = jwt.sign({ id: adminUser._id }, process.env.SECRET_KEY);
                const adminResponse = {
                    _id: adminUser._id,
                    username: adminUser.username,
                    email: adminUser.email,
                    role: adminUser.role
                };
                
                console.log("Sending admin response:", adminResponse); // Debug log
                res.status(200).json({
                    message: "Admin logged in successfully!",
                    token: token,
                    user: adminResponse
                });
                return;
            }

            // Regular user login
            const user = await userModel.findOne({ email });
            console.log("Found user:", user ? "Yes" : "No"); 
            
            if (user) {
                bcrypt.compare(password, user.password, (error, result) => {
                    if (error) {
                        console.error("Password comparison error:", error);
                        res.status(400).json({ message: 'Invalid Credentials', error: error.message });
                        return;
                    }
                    
                    if (result) {
                        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                        const userResponse = {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        };
                        console.log("Sending user response:", userResponse); 
                        res.status(200).json({ 
                            message: "You are Logged in!", 
                            token: token, 
                            user: userResponse
                        });
                    } else {
                        console.log("Password mismatch for user:", email); 
                        res.status(400).json({ message: 'Invalid Credentials' });
                    }
                });
            } else {
                console.log("No user found with email:", email); 
                res.status(400).json({ message: 'Invalid Credential' });
            }
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

export const logout = async (req, res) => {
    console.log("logout controller")
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token)
    try {
        if (token) {
            blacklist.push(token)
            res.status(200).json({ message: "you are logOut!" })
        }
    } catch (error) {
        res.status(400).json({ message: error })
    }
}