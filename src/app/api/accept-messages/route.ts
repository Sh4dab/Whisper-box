import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect()

    const session= await getServerSession(authOptions)
    const user: User= session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId= user._id;
    const {acceptMessage} = await request.json()

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessage},{new:true})

        if(!updatedUser){
            return Response.json({
                success: false,
                message:"Failed to update user status to accept messages"
            },{status:401})
        }
        return Response.json({
            success: true,
            message:"Message acceptance status updated successfully",
            updatedUser
        },{status:200})

    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json({
            success: false,
            message:"Failed to update user status to accept messages"
        },{status:500})  
    }
}


export async function GET(request:Request){
    await dbConnect()

    const session= await getServerSession(authOptions)
    const user: User= session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId= user._id;

    try {
        const foundUser=await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                success: false,
                message:"User Not Found"
            },{status:404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },{status:200})

    } catch (error) {
        console.log("Error in getting message accepting status");
        return Response.json({
            success: false,
            message:"Error in getting message accepting status"
        },{status:500}) 
    }
}  