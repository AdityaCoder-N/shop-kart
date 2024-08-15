import UserModel from "@/models/UserModel";
import dbConnect from "@/utils/dbConnect";

export async function POST(request:Request){

    dbConnect();
    try {
        const {userEmail,product} = await request.json();

        if(!userEmail || !product){
            return Response.json({success:false, message:"All fields not received"},{status:400});
        }

        const user = await UserModel.findOne({email:userEmail}).select('cart');

        if(!user){
            return Response.json({success:false, message:"User Not Found"},{status:400});
        }

        // Checking if product already exists
        let productExists = false;
        console.log(product);
        for (let i = 0; i < user.cart.length; i++) {
            if (String(user.cart[i].id) === String(product.id)) {
                productExists = true;
                break;
            }
        }

        if (productExists) {
            return Response.json({success:false, message:"Product already exists in cart"},{status:400});
        } else {
            user.cart.push(product);
        }
    
        await user.save();
        return Response.json({success:true, message:"Product added to cart."},{status:200});
      
    } catch (error) {
        console.log("Error Adding to Cart",error);
        return Response.json({success:false, message:"Error Adding to cart"},{status:500});
    }

}