import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { firstName, middleName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All required fields must be filled" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ message: "Signup successful", token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
