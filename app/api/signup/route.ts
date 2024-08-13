import dbConnect from "@/utils/dbConnect";
import bcrypt from 'bcryptjs'
import UserModel from "@/models/UserModel";

export  async function POST(req:Request){
    
    dbConnect();

    try {
        const {username, email, password} = await req.json();
        
        if(!username || !email || !password){
            return Response.json({success:false,message:"Fields Not Found"},{status:400});
        }

        const user = await UserModel.findOne({email});
        if(user){
            return Response.json({success:false,message:"A User already exists with this email"},{status:400});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new UserModel({
            username,email,password:hashedPassword
        });

        await newUser.save();

        return Response.json({success:true,message:"User Registered Successfully"},{status:200});

    } catch (error) {
        console.log("Error Registering User",error);
        return Response.json({success:false,message:"Sign Up Failed, Try again later"},{status:500});
    }
}