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
    },
    cart: {
        type: [
          {
            id: String,
            title: String,
            price: Number,
            image: String,
            description: String,
            category: String,
            rating: {
              rate: Number,
              count: Number,
            },
            quantity:Number
          },
        ],
        default: [],
    },
});

const UserModel = (mongoose.models.User) || mongoose.model("User",UserSchema);

export default UserModel;

