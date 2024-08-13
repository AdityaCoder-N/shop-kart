import mongoose, {Schema,Document} from "mongoose";

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const UserModel = (mongoose.models.User) || mongoose.model("User",UserSchema);

export default UserModel;

