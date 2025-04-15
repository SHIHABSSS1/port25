'use client';

import React from 'react';
import Link from 'next/link';
import { Social } from '../types';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaGlobe } from 'react-icons/fa';

interface FooterProps {
  socials: Social[];
}

const Footer: React.FC<FooterProps> = ({ socials }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <FaGithub />;
      case 'linkedin':
        return <FaLinkedin />;
      case 'twitter':
        return <FaTwitter />;
      case 'instagram':
        return <FaInstagram />;
      case 'facebook':
        return <FaFacebook />;
      default:
        return <FaGlobe />;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Shihab Hossain</h3>
            <p className="text-gray-300 mb-4">
              Electronics Engineer & Web Developer
            </p>
            <div className="flex space-x-4">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  aria-label={social.platform}
                >
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="#experience" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Email: <a href="mailto:shihabhossain596@gmail.com" className="hover:text-white transition-colors duration-300">shihabhossain596@gmail.com</a></p>
              <p>Phone: <a href="tel:01745368299" className="hover:text-white transition-colors duration-300">01745368299</a></p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Shihab Hossain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;