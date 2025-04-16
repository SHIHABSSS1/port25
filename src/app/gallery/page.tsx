'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent } from '../../lib/firestore';
import { defaultContent } from '../../lib/firestore';
import { SiteContent, Gallery } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

export default function GalleryPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const siteContent = await getSiteContent();
        
        // Ensure gallery property exists in the fetched content
        if (!siteContent.gallery) {
          siteContent.gallery = defaultContent.gallery;
        }
        
        setContent(siteContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Placeholder images if none are available
  const defaultGalleryImages = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg'
  ];

  // Ensure we have images to display
  const displayImages = content.gallery.images.length > 0 
    ? content.gallery.images 
    : defaultGalleryImages;

  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % displayImages.length
      : (selectedIndex - 1 + displayImages.length) % displayImages.length;
    
    setSelectedIndex(newIndex);
    setSelectedImage(displayImages[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link 
              href="/#gallery" 
              className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Gallery</span>
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {content.gallery.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {content.gallery.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="aspect-[4/3] relative cursor-pointer"
                  onClick={() => openLightbox(image, index)}
                >
                  <Image
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Photo {index + 1}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer socials={content.socials} />
      
      {/* Facebook-style Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
          onClick={closeLightbox}
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center bg-gray-900 z-10">
            <div className="text-white font-medium">
              {`Photo ${selectedIndex + 1} of ${displayImages.length}`}
            </div>
            <button
              onClick={closeLightbox}
              className="text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Image container */}
          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous button */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
              aria-label="Previous image"
            >
              <FaArrowLeft />
            </button>
            
            {/* Image */}
            <div className="relative w-full h-full max-h-[80vh] max-w-5xl">
              <Image
                src={selectedImage}
                alt={`Gallery image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            {/* Next button */}
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
              aria-label="Next image"
            >
              <FaArrowLeft className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 