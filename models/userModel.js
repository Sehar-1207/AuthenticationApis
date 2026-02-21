import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    image:{
        type:String
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;