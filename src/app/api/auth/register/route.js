import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from 'next/server'
 
export async function POST(request) {
  const { email, password } = await request.json()
  
  await connect();

  const newUser = new User({
    email,
    password: password,
  });

  try {
    await newUser.save();
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}