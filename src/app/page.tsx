'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsSection from '../components/ProjectsSection';
import SocialSection from '../components/SocialSection';
import ContactSection from '../components/ContactSection';
import ChangelogSection from '../components/ChangelogSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getSiteContent } from '../lib/firestore';
import { SiteContent } from '../types';
import { defaultContent } from '../lib/firestore';

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const siteContent = await getSiteContent();
        setContent(siteContent);
      } catch (error) {
        console.error('Error fetching content:', error);
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <HeroSection hero={content.hero} />
      <AboutSection about={content.about} />
      <ExperienceSection experiences={content.experiences} />
      <ProjectsSection projects={content.projects} />
      <SocialSection socials={content.socials} />
      <ContactSection contact={content.contact} />
      <ChangelogSection initialItemsToShow={1} />
      <Footer socials={content.socials} />
    </div>
  );
}
