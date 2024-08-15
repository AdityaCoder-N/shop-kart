import UserModel from "@/models/UserModel";
import dbConnect from "@/utils/dbConnect";

export async function GET(
    request:Request,
    {params}:{ params:{userEmail:string} }
){
    dbConnect();
    try {
        const {userEmail} = params;
        const user = await UserModel.findOne({email:userEmail}).select('cart');

        if(!user){
            return Response.json({success:false, message:"User Not Found"},{status:400});
        }

        return Response.json({success:true, message:"Cart fetched successfully", cart:user.cart},{status:200});

    } catch (error) {
        console.log("Error Fetching User's cart",error);
        return Response.json({success:false, message:"Error Fetching User's cart"},{status:500});
    }
}