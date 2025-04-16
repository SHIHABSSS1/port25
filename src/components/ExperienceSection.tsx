'use client';

import React from 'react';
import { Experience } from '../types';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  // Show only the latest 3 experiences on the home page
  const recentExperiences = experiences.slice(0, 3);

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Professional Experience
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mt-2"></div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-800"></div>

          {/* Experience items */}
          {recentExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className={`md:flex mb-12 relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2"></div>
              
              {/* Timeline dot */}
              <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                <div className="h-5 w-5 rounded-full bg-indigo-600 border-4 border-white dark:border-gray-900"></div>
              </div>
              
              <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {experience.position}
                  </h3>
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                    {experience.company}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {experience.duration}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    {experience.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Experience (only visible on mobile) */}
        <div className="md:hidden space-y-8 mt-8">
          {recentExperiences.map((experience, index) => (
            <motion.div 
              key={experience.id}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {experience.position}
              </h3>
              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {experience.company}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {experience.duration}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                {experience.description}
              </p>
            </motion.div>
          ))}
        </div>

        {experiences.length > 3 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/experience"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
            >
              View All Experience ({experiences.length})
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;