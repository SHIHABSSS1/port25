'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import { Gallery } from '../types';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

// Import slick carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface GallerySectionProps {
  gallery?: Gallery;
}

const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Create a default gallery if none is provided
  const defaultGallery: Gallery = {
    title: 'Photo Gallery',
    description: 'A collection of moments and memories captured throughout my journey.',
    images: [
      '/images/hero-1.jpg',
      '/images/hero-2.jpg',
      '/images/hero-3.jpg'
    ]
  };

  // Use the provided gallery or fallback to default
  const galleryData = gallery || defaultGallery;
  
  // Custom arrow components for the slider
  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md text-gray-800 hover:bg-white"
        onClick={onClick}
      >
        <FaArrowRight />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md text-gray-800 hover:bg-white"
        onClick={onClick}
      >
        <FaArrowLeft />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Ensure we have images to display
  const displayImages = galleryData.images.length > 0 
    ? galleryData.images 
    : defaultGallery.images;

  const openLightbox = (image: string) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {galleryData.title}
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mt-2"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {galleryData.description}
          </p>
        </div>

        {/* Carousel view */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Slider {...settings}>
            {displayImages.map((image, index) => (
              <div key={index} className="px-2">
                <div 
                  className="h-64 relative rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>

        {/* View All Photos button redirects to dedicated gallery page */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            View All Photos
          </Link>
        </div>

        {/* Lightbox for preview (stays on the same page) */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full h-full max-h-[80vh] flex flex-col">
              <button
                onClick={closeLightbox}
                className="absolute right-0 top-0 m-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 z-10"
              >
                <FaTimes />
              </button>
              <div className="relative flex-1">
                <Image
                  src={selectedImage}
                  alt="Enlarged gallery image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/gallery"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                >
                  View All Photos
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection; 