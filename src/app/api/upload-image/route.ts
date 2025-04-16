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

    const { image, folder } = await request.json();

    if (!image) {
      throw new Error('No image data provided');
    }

    // Upload to Cloudinary with additional options
    const result = await cloudinary.uploader.upload(image, {
      folder: `portfolio/${folder}`,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return NextResponse.json({ 
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error uploading image' },
      { status: 500 }
    );
  }
} 