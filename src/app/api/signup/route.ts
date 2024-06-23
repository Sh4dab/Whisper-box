import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect();
    try {
        const {username,email,password}= await request.json();
        const existingUser= await UserModel.findOne({
            username,
        })
        if(existingUser){
            return Response.json({
                success:false,
                message: "Username is already taken"
            },{status:400})
        }

        const existingUserByEmail= await UserModel.findOne({
            email,
        })
        if(existingUserByEmail){
            return Response.json({
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

            return Response.json({
                  success: true,
                  message: 'User registered successfully',
                },{ status: 200 }
              );
        }
    } catch (error:any) {
        console.log("Error Registering User",error);
        return Response.json({
            success:false,
            message:"Error Registering User"
        },{status:500})
    }
}
