# Shihab Hossain - Portfolio Website

A modern portfolio website for Shihab Hossain, an Electronics Engineer and Web Developer. The website showcases professional experience, projects, and skills with a beautiful, responsive design.

## Features

- **Modern UI/UX Design**: Clean, professional, and responsive layout
- **Image Carousel**: Auto-sliding image carousel in the hero section
- **Admin Panel**: Secure admin panel to manage all website content
- **Firebase Integration**: Authentication, Firestore database, and Storage for images
- **Dynamic Content**: All sections can be updated through the admin interface
- **Responsive Design**: Works on all devices from mobile to desktop
- **Dark Mode Support**: Automatic dark mode based on user preferences

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript for robust code
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Firebase**: Authentication, Firestore database, and Storage
- **React Slick**: For image carousel functionality
- **React Hook Form**: For form handling and validation
- **Framer Motion**: For smooth animations and transitions
- **Netlify**: For deployment and hosting

## Getting Started

### Prerequisites

- Node.js 16.8+ and npm/yarn installed
- Firebase account for backend services

### Installation

1. Clone the repository
   ```
   git clone https://github.com/SHIHABSSS1/port25.git
   cd port25
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   npm install cloudinary next-cloudinary
   ```

3. Create a `.env.local` file with your Firebase configuration
   ```
   # Copy the example file
   cp .env.local.example .env.local
   # Edit with your Firebase details
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCpbQWLfQEhO7HuqgZEzUr0VhOldbyvt9w
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shihab-portfolio-582e8.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=shihab-portfolio-582e8
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shihab-portfolio-582e8.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=495857341508
   NEXT_PUBLIC_FIREBASE_APP_ID=1:495857341508:web:dd4e14f4d0602d2f9d5811
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=portfolio
   CLOUDINARY_API_KEY=515638874541828
   CLOUDINARY_API_SECRET=m9gsJdbL2jhfar4Czt2tfI5qwKg
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment with Netlify

This project is configured for deployment on Netlify. The `netlify.toml` file in the root directory contains all the necessary configuration.

To deploy:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically deploy your site when you push changes

## Cloudinary Integration

Create a file at `src/app/api/upload-image/route.ts`:

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request: Request) {
  try {
    const { image, folder } = await request.json();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: `portfolio/${folder}`
    });

    return NextResponse.json({ 
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { message: 'Error uploading image' },
      { status: 500 }
    );
  }
}
```

This file sets up a serverless function to handle image uploads to Cloudinary.

## Cloudinary Utility File

Create `src/lib/cloudinary.ts`:

```typescript
import { uploadImage as cloudinaryUpload } from './cloudinary';

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const url = await cloudinaryUpload(file, path);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
```