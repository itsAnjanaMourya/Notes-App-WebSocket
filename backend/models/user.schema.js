import mongoose from "mongoose"
const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    versionKey: false
})
const userModel = mongoose.model("user", UserSchema)
export default userModel;