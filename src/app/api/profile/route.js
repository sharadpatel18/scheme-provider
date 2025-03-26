import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import UserProfile from '@/models/UserProfile';

export async function POST(request) {
  
  try {
    await connectDB();
    
    const profileData = await request.json();
    
    // Generate a unique userId if not provided
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new profile with userId
    const profile = await UserProfile.create({
      ...profileData,
      userId,
      disability: profileData.disability.toLowerCase(),
      communicationMode: profileData.communicationMode.toLowerCase()
    });
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save profile' },
      { status: 500 }
    );
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