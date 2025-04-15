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
   ```

3. Create a `.env.local` file with your Firebase configuration
   ```
   # Copy the example file
   cp .env.local.example .env.local
   # Edit with your Firebase details
   ```

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The website can be deployed to Netlify using GitHub integration:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add your environment variables in Netlify settings

## Admin Access

To access the admin panel:

1. Go to `/login` route
2. Log in with your admin credentials
3. You will be redirected to the admin dashboard where you can update all content

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Shihab Hossain - shihabhossain596@gmail.com
