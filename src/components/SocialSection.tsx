'use client';

import React from 'react';
import { Social } from '../types';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SocialSectionProps {
  socials: Social[];
}

const SocialSection: React.FC<SocialSectionProps> = ({ socials }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <FaGithub className="text-4xl" />;
      case 'linkedin':
        return <FaLinkedin className="text-4xl" />;
      case 'twitter':
        return <FaTwitter className="text-4xl" />;
      case 'instagram':
        return <FaInstagram className="text-4xl" />;
      case 'facebook':
        return <FaFacebook className="text-4xl" />;
      default:
        return <FaGlobe className="text-4xl" />;
    }
  };

  return (
    <section className="py-16 bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Connect With Me
          </motion.h2>
          <div className="w-20 h-1 bg-white mx-auto mt-2"></div>
        </div>

        <div className="flex justify-center space-x-8 flex-wrap">
          {socials.map((social, index) => (
            <motion.a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-200 transition-colors duration-300 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
            >
              {getIcon(social.platform)}
              <span className="mt-2">{social.platform}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialSection; 