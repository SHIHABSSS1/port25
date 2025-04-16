'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { getSiteContent } from '../../lib/firestore';
import { Experience } from '../../types';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getSiteContent();
        setExperiences(content.experiences);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Professional Experience
          </motion.h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mt-4"></div>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A comprehensive overview of my professional journey
          </motion.p>
        </div>

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-800"></div>

          {/* Experience items */}
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className={`md:flex mb-12 relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="md:w-1/2"></div>
              
              {/* Timeline dot */}
              <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                <div className="h-5 w-5 rounded-full bg-indigo-600 border-4 border-white dark:border-gray-900"></div>
              </div>
              
              <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {experience.position}
                  </h2>
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                    {experience.company}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {experience.duration}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-line">
                    {experience.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Experience (only visible on mobile) */}
        <div className="md:hidden space-y-8 mt-8">
          {experiences.map((experience, index) => (
            <motion.div 
              key={experience.id}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {experience.position}
              </h2>
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {experience.company}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {experience.duration}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-line">
                {experience.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 