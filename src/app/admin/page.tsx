'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getSiteContent, updateSiteContent, uploadImage } from '../../lib/firestore';
import { SiteContent } from '../../types';
import Link from 'next/link';
import { FaArrowLeft, FaImage, FaSave } from 'react-icons/fa';

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const siteContent = await getSiteContent();
        setContent(siteContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [loading, isAdmin, router]);

  const handleSave = async () => {
    if (!content) return;

    try {
      setIsSaving(true);
      await updateSiteContent(content);
      setSaveMessage('Changes saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveMessage('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroChange = (field: string, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value
      }
    });
  };

  const handleAboutChange = (field: string, value: string | string[]) => {
    if (!content) return;
    setContent({
      ...content,
      about: {
        ...content.about,
        [field]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (!content) return;
    setContent({
      ...content,
      about: {
        ...content.about,
        skills: [...content.about.skills, '']
      }
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    if (!content) return;
    const newSkills = [...content.about.skills];
    newSkills[index] = value;
    setContent({
      ...content,
      about: {
        ...content.about,
        skills: newSkills
      }
    });
  };

  const handleRemoveSkill = (index: number) => {
    if (!content) return;
    const newSkills = [...content.about.skills];
    newSkills.splice(index, 1);
    setContent({
      ...content,
      about: {
        ...content.about,
        skills: newSkills
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;

    try {
      const url = await uploadImage(file, `${section}/${field}`);
      if (section === 'hero') {
        const newImages = [...content.hero.images];
        newImages.push(url);
        setContent({
          ...content,
          hero: {
            ...content.hero,
            images: newImages
          }
        });
      } else if (section === 'about') {
        setContent({
          ...content,
          about: {
            ...content.about,
            photo: url
          }
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleRemoveHeroImage = (index: number) => {
    if (!content) return;
    const newImages = [...content.hero.images];
    newImages.splice(index, 1);
    setContent({
      ...content,
      hero: {
        ...content.hero,
        images: newImages
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (!content) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              <FaArrowLeft />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      {saveMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md ${saveMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {saveMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 md:pr-8 mb-8 md:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <nav className="px-2 py-4 space-y-1">
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'hero' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Hero Section
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'about' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  About Section
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'experience' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'projects' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('socials')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'socials' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Social Links
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'contact' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Contact Info
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {activeTab === 'hero' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hero Section</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => handleHeroChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={content.hero.subtitle}
                        onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={content.hero.buttonText}
                        onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={content.hero.buttonLink}
                        onChange={(e) => handleHeroChange('buttonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hero Images
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {content.hero.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Hero ${index + 1}`}
                              className="h-32 w-full object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveHeroImage(index)}
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white rounded-md transition-opacity"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <label className="h-32 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400">
                          <FaImage className="text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Add Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e, 'hero', 'images')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About Section</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.about.title}
                        onChange={(e) => handleAboutChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={6}
                        value={content.about.description}
                        onChange={(e) => handleAboutChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Photo
                      </label>
                      
                      <div className="flex items-center space-x-4">
                        <div className="h-32 w-32 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {content.about.photo ? (
                            <img 
                              src={content.about.photo} 
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              No Photo
                            </div>
                          )}
                        </div>
                        
                        <label className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                          <span className="text-sm text-indigo-600 dark:text-indigo-400">Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e, 'about', 'photo')}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills
                      </label>
                      
                      <div className="space-y-2">
                        {content.about.skills.map((skill, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => handleSkillChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-2 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="mt-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Add Skill
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs will be implemented similarly */}
              {activeTab === 'experience' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Experience</h2>
                  <p className="text-gray-500 dark:text-gray-400">Experience editing will be fully implemented soon.</p>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projects</h2>
                  <p className="text-gray-500 dark:text-gray-400">Project editing will be fully implemented soon.</p>
                </div>
              )}

              {activeTab === 'socials' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h2>
                  <p className="text-gray-500 dark:text-gray-400">Social links editing will be fully implemented soon.</p>
                </div>
              )}

              {activeTab === 'contact' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
                  <p className="text-gray-500 dark:text-gray-400">Contact information editing will be fully implemented soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 