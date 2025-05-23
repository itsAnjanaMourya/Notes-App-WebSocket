import userModel from '../models/user.schema.js';
import noteModel from '../models/note.schema.js';


export const getAllUsers = async (req, res) => {
    try {
        console.log('Fetching all users except admin...');
        const users = await userModel.find(
            { role: { $ne: 'admin' } }, 
            { password: 0 }
        );
        console.log('Found users:', users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ 
            message: 'Error fetching users',
            error: error.message 
        });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        console.log('Fetching all tasks...');
        const tasks = await noteModel.find()
            .populate({
                path: 'user',
                select: 'username email',
                model: 'user'
            });
        
        console.log('Found tasks:', tasks.length);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in getAllTasks:', error);
        res.status(500).json({ 
            message: 'Error fetching tasks',
            error: error.message 
        });
    }
};

export const getUserTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching tasks for user:', userId);

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await noteModel.find({ user: userId })
            .populate('user', 'username email');
        
        console.log('Found tasks:', tasks.length);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in getUserTasks:', error);
        res.status(500).json({ message: 'Error fetching user tasks' });
    }
}; 