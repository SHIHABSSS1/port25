'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import { Hero } from '../types';
import { motion } from 'framer-motion';

// Import slick carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface HeroSectionProps {
  hero: Hero;
}

const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  // Default images in case none are provided
  const defaultImages = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
  ];

  const images = hero.images.length > 0 ? hero.images : defaultImages;

  return (
    <section className="relative h-screen">
      {/* Image carousel */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Slider {...settings} className="h-full">
          {images.map((image, index) => (
            <div key={index} className="h-screen w-full relative">
              <div className="absolute inset-0 bg-black/50 z-10" />
              {image ? (
                <Image
                  src={image}
                  alt={`Hero Image ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-700 h-full w-full" />
              )}
            </div>
          ))}
        </Slider>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              {hero.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto">
              {hero.subtitle}
            </p>
            <Link 
              href={hero.buttonLink}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
            >
              {hero.buttonText}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 