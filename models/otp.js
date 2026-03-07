import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    otp:{
        required:true,
        type: Number,
    },
    timestamp:{
        type: Date,
        default: Date.now,
        required: true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp),
    } 
});
const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
export default Otp;