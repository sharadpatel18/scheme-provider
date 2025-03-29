import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import UserProfile from '@/models/UserProfile';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT secret key - store this in .env.local
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse the request body
    const data = await request.json();
    
    const existingUser = await UserProfile.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists'
      }, { status: 400 });
    }
    console.log('Received profile data:', data);
    console.log(data.data);
    // Generate a unique userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Hash the password if provided
    let hashedPassword;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(data.password, salt);
    }

    // Transform the data to match the schema
    const profileData = {
      ...data,
      userId,
      // Hash password if it exists
      ...(hashedPassword && { password: hashedPassword }),
      // Convert to lowercase for enum validation
      gender: data.gender?.toLowerCase(),
      disability: data.disability?.toLowerCase(),
      communicationMode: data.communicationMode?.toLowerCase(),
      category: data.category?.toLowerCase(),
      education: data.education?.toLowerCase(),
      occupation: data.occupation?.toLowerCase()
    };

    console.log('Transformed profile data:', profileData);

    // Create new profile
    const profile = await UserProfile.create(profileData);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: profile.userId,
        email: profile.email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data from response
    const { password, ...profileWithoutPassword } = profile.toObject();

    return NextResponse.json({ 
      success: true, 
      message: 'Profile created successfully',
      data: profileWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Profile creation error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseServerSelectionError') {
      return NextResponse.json({ 
        success: false,
        message: 'Unable to connect to database. Please try again later.'
      }, { status: 503 });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', validationErrors);
      return NextResponse.json({ 
        success: false,
        message: 'Invalid profile data',
        errors: validationErrors
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ 
        success: false,
        message: `A profile with this ${field} already exists`
      }, { status: 409 });
    }

    // Generic error response
    return NextResponse.json({ 
      success: false,
      message: error.message || 'An error occurred while creating the profile'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const profiles = await UserProfile.find({});
    
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
} 