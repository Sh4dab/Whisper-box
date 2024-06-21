import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    await dbConnect();
    console.log("hi");
    try {
        const {username,email,password}= await request.json();
        const existingUser= await UserModel.findOne({
            username,
        })
        if(existingUser){
            return NextResponse.json({
                success:false,
                message: "Username is already taken"
            },{status:400})
        }

        const existingUserByEmail= await UserModel.findOne({
            email,
        })
        if(existingUserByEmail){
            return NextResponse.json({
                success:false,
                message: "User already exist with this email"
            },{status:400})
        }else{
            const hashedPassword=await bcrypt.hash(password,10)

            const newUser=new UserModel({
                username,
                email,
                password: hashedPassword,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }
    } catch (error:any) {
        console.log("Error Registering User",error);
        return NextResponse.json({
            success:false,
            message:"Error Registering User"
        },{status:500})
    }
}
