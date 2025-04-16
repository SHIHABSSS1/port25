'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contact } from '../types';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface ContactSectionProps {
  contact: Contact;
}

type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, touchedFields, isSubmitted } 
  } = useForm<FormData>({
    mode: 'onTouched'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const form = useRef<HTMLFormElement>(null);

  // Initialize EmailJS on component mount
  useEffect(() => {
    emailjs.init('ej90EMXzV9wejaMPf');
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      if (!form.current) return;

      // Create a template params object manually instead of relying on form names
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_email: contact.email
      };

      // Use send method instead of sendForm
      const result = await emailjs.send(
        'service_asoeouv',
        'template_eymrmhd',
        templateParams
      );

      if (result.text === 'OK') {
        setSubmitSuccess(true);
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email</h4>
                  <a href={`mailto:${contact.email}`} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaPhone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h4>
                  <a href={`tel:${contact.phone}`} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {contact.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400 mr-3">
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Location</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send Me a Message</h3>
            
            <form ref={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Your Name"
                  {...register('name', { required: 'Name is required' })}
                />
                {(touchedFields.name || isSubmitted) && errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="your.email@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {(touchedFields.email || isSubmitted) && errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Your message here..."
                  {...register('message', { required: 'Message is required' })}
                />
                {(touchedFields.message || isSubmitted) && errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              
              {submitSuccess && (
                <p className="text-green-600 dark:text-green-400">
                  Your message has been sent successfully! I&apos;ll get back to you soon.
                </p>
              )}
              
              {submitError && (
                <p className="text-red-600 dark:text-red-400">
                  {submitError}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;