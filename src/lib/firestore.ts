import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { SiteContent } from '../types';
import { changelog } from '../data/changelog';
import { uploadImage as cloudinaryUpload } from './cloudinary';

// Default content structure
export const defaultContent: SiteContent = {
  hero: {
    title: 'Shihab Hossain',
    subtitle: 'Electronics Engineer & Web Developer',
    buttonText: 'View My Work',
    buttonLink: '#projects',
    images: []
  },
  about: {
    title: 'About Me',
    description: "I'm a passionate Electronics Engineer with a diverse background in embedded systems, web development, digital marketing, and IT service. I thrive on learning, building, and leading, with a strong focus on practical innovation and real-world impact.\n\nCurrently, I'm working at Genex (Grameenphone Digital), where I handle live chat and email-based customer support, gaining hands-on experience in communication, customer service, and IT operations.\n\nMy journey into web development began with a curiosity to bring ideas to life on the internet. I started by building full-stack applications with a clear separation between the frontend and backend for better structure and scalability.",
    photo: '',
    skills: ['Electronics Engineering', 'Web Development', 'IoT', 'Digital Marketing']
  },
  experiences: [
    {
      id: '1',
      company: 'Genex (Grameenphone Digital)',
      position: 'Customer Support Specialist',
      duration: '2023 - Present',
      description: 'Handle live chat and email-based customer support, gaining hands-on experience in communication, customer service, and IT operations.'
    },
    {
      id: '2',
      company: 'Mirro Tech',
      position: 'Founder',
      duration: '2021 - 2023',
      description: 'Led projects involving digital subscription products like Canva and Netflix. Experience in client handling, digital product delivery, and team coordination.'
    }
  ],
  gallery: {
    title: 'Photo Gallery',
    description: 'A collection of moments and memories captured throughout my journey.',
    images: []
  },
  projects: [
    {
      id: '1',
      title: 'CSV Search Tool',
      description: 'Developed a CSV search tool with clean UI, efficient search logic, and smooth user interaction.',
      image: '',
      tags: ['React', 'Node.js', 'CSV'],
      link: '#',
      github: '#'
    },
    {
      id: '2',
      title: 'IoT Weather Station',
      description: 'Built an IoT-based weather station using Arduino and ESP8266 with Blynk platform integration.',
      image: '',
      tags: ['IoT', 'Arduino', 'ESP8266', 'Blynk'],
      link: '#'
    }
  ],
  socials: [
    {
      id: '1',
      platform: 'GitHub',
      link: 'https://github.com/SHIHABSSS1',
      icon: 'github'
    },
    {
      id: '2',
      platform: 'LinkedIn',
      link: '#',
      icon: 'linkedin'
    }
  ],
  contact: {
    email: 'shihabhossain596@gmail.com',
    phone: '01745368299',
    address: 'Bangladesh'
  },
  changelog: changelog
};

// Get site content
export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (!db) {
      console.warn('Firestore not initialized, returning default content');
      return defaultContent;
    }
    
    try {
      const docRef = doc(db, 'site', 'content');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SiteContent;
      }
    } catch (error) {
      console.error('Firestore permission error, using default content', error);
      // Try to detect if this is a CORS or network issue
      if (error instanceof Error && 
         (error.message.includes('insufficient permissions') || 
          error.message.includes('network error') ||
          error.message.includes('ERR_BLOCKED'))) {
        console.warn('CORS or network issue detected, using local content');
      }
      // Fall through to use default content
    }
    
    // If content doesn't exist or there was an error, use default
    return defaultContent;
  } catch (error) {
    console.error('Error getting site content:', error);
    return defaultContent;
  }
}

// Update site content
export async function updateSiteContent(content: Partial<SiteContent>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    
    const docRef = doc(db, 'site', 'content');
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // If document doesn't exist, create it with initial content
      await setDoc(docRef, {
        ...defaultContent,
        ...content
      });
    } else {
      // If document exists, update it
      await updateDoc(docRef, content);
    }
  } catch (error) {
    console.error('Error updating site content:', error);
    throw error;
  }
}

// Upload image using Cloudinary
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const url = await cloudinaryUpload(file, path);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Delete image from Cloudinary
export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract public_id from the URL
    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
    
    // Send delete request to API route
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
} 