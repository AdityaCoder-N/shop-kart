import UserModel from "@/models/UserModel";
import dbConnect from "@/utils/dbConnect";

export async function POST(request:Request){

    dbConnect();
    try {
        const { userEmail } = await request.json();

        if(!userEmail){
            return Response.json({success:false, message:"User email not received"},{status:400});
        }

        const user = await UserModel.findOne({email:userEmail}).select('cart');

        if(!user){
            return Response.json({success:false, message:"User Not Found"},{status:400});
        }

        const count = user.cart.length;

        return Response.json({success:true, count, message:"Cart count fetched successfully."},{status:200});
      
    } catch (error) {
        console.log("Error Fetching Cart Count",error);
        return Response.json({success:false, message:"Error Fetching Cart Count"},{status:500});
    }


}