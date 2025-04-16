import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request: Request) {
  try {
    // Verify Cloudinary configuration
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary configuration');
    }

    const { public_id } = await request.json();

    if (!public_id) {
      throw new Error('No public_id provided');
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error deleting image' },
      { status: 500 }
    );
  }
} 