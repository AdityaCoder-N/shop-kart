import UserModel from "@/models/UserModel";
import { ProductType } from "@/types";
import dbConnect from "@/utils/dbConnect";

export async function POST(request:Request){

    dbConnect();
    try {
        const {userEmail,productId} = await request.json();

        if(!userEmail || !productId){
            return Response.json({success:false, message:"All fields not received"},{status:400});
        }
        const user = await UserModel.findOne({email:userEmail});
        if(!user){
            return Response.json({success:false, message:"User Not Found"},{status:400});
        }

        const productIndex = user.cart.findIndex((item: ProductType) => item.id === productId);

        if (productIndex === -1) {
            return Response.json({ success: false, message: 'Product not found in cart' }, { status: 404 });
        }

        // Removing the product from cart
        user.cart.splice(productIndex, 1);

        await user.save();

        return Response.json({success:true, message:"Product removed from cart"},{status:200});

    } catch (error) {
        console.log("Error Removing from Cart",error);
        return Response.json({success:false, message:"Error Removing from cart"},{status:500});
    }
}