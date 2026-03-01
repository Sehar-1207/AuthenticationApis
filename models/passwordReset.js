import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
   
    user_id:{
        type:String,
        required:true,
        ref: 'User'
    },
    token:{
        type:String,
        required:true  
     }
    
});

const passwordReset = mongoose.models.passwordReset || mongoose.model("passwordReset", passwordResetSchema);
export default passwordReset;