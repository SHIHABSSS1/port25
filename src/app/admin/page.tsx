'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getSiteContent, updateSiteContent, uploadImage } from '../../lib/firestore';
import { SiteContent, Social, Contact, Experience, Project } from '../../types';
import Link from 'next/link';
import { FaArrowLeft, FaImage, FaSave } from 'react-icons/fa';
import { ChangelogItem } from '../../data/changelog';
import { v4 as uuidv4 } from 'uuid';

export default function AdminPage() {
  const { loading, user, isAdmin } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [authDebug, setAuthDebug] = useState<string | null>(null);
  const [newChangelogItem, setNewChangelogItem] = useState<ChangelogItem>({
    date: new Date().toISOString().split('T')[0],
    version: '',
    title: '',
    changes: ['']
  });
  const [newSocial, setNewSocial] = useState<{platform: string; link: string}>({
    platform: '',
    link: ''
  });
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    duration: '',
    description: ''
  });
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    github: ''
  });

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
    // Add debug info to help troubleshoot
    if (loading) {
      setAuthDebug('Loading authentication state...');
    } else if (!user) {
      setAuthDebug('Not logged in. Redirecting to login page...');
      // Add a small delay before redirecting
      const timer = setTimeout(() => {
        router.push('/login?redirectTo=/admin');
      }, 500);
      return () => clearTimeout(timer);
    } else if (!isAdmin) {
      setAuthDebug('User logged in but not an admin. Redirecting to login page...');
      // Add a small delay before redirecting
      const timer = setTimeout(() => {
        router.push('/login?redirectTo=/admin');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAuthDebug('User is authenticated and has admin rights.');
    }
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    // Initialize the gallery property if it doesn't exist in the fetched content
    if (content && !content.gallery) {
      setContent({
        ...content,
        gallery: {
          title: 'Photo Gallery',
          description: 'A collection of moments and memories captured throughout my journey.',
          images: []
        }
      });
    }
  }, [content]);

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
      } else if (section === 'gallery') {
        const newImages = [...content.gallery.images];
        newImages.push(url);
        setContent({
          ...content,
          gallery: {
            ...content.gallery,
            images: newImages
          }
        });
      } else if (section === 'projects') {
        const updatedProjects = [...content.projects];
        updatedProjects[parseInt(field)] = {
          ...updatedProjects[parseInt(field)],
          image: url
        };
        setContent({
          ...content,
          projects: updatedProjects
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

  const handleAddChangelogItem = () => {
    if (!content) return;
    
    // Validate required fields
    if (!newChangelogItem.version || !newChangelogItem.title || newChangelogItem.changes.some(change => !change)) {
      setSaveMessage('Please fill in all fields for the changelog entry');
      return;
    }

    // Add the new changelog item to the content
    const updatedChangelog = [newChangelogItem, ...content.changelog];
    
    setContent({
      ...content,
      changelog: updatedChangelog
    });
    
    // Reset the form
    setNewChangelogItem({
      date: new Date().toISOString().split('T')[0],
      version: '',
      title: '',
      changes: ['']
    });
    
    setSaveMessage('Changelog entry added! Don\'t forget to save changes.');
  };

  const handleChangelogItemChange = (field: keyof ChangelogItem, value: string) => {
    setNewChangelogItem({
      ...newChangelogItem,
      [field]: value
    });
  };

  const handleChangelogChangeText = (index: number, value: string) => {
    const updatedChanges = [...newChangelogItem.changes];
    updatedChanges[index] = value;
    setNewChangelogItem({
      ...newChangelogItem,
      changes: updatedChanges
    });
  };

  const handleAddChangelogChange = () => {
    setNewChangelogItem({
      ...newChangelogItem,
      changes: [...newChangelogItem.changes, '']
    });
  };

  const handleRemoveChangelogChange = (index: number) => {
    if (newChangelogItem.changes.length <= 1) return;
    
    const updatedChanges = [...newChangelogItem.changes];
    updatedChanges.splice(index, 1);
    setNewChangelogItem({
      ...newChangelogItem,
      changes: updatedChanges
    });
  };

  const handleGalleryChange = (field: string, value: string) => {
    if (!content) return;
    
    // Initialize gallery if it doesn't exist
    if (!content.gallery) {
      content.gallery = {
        title: '',
        description: '',
        images: []
      };
    }
    
    setContent({
      ...content,
      gallery: {
        ...content.gallery,
        [field]: value
      }
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!content || !content.gallery) return;
    
    const newImages = [...content.gallery.images];
    newImages.splice(index, 1);
    setContent({
      ...content,
      gallery: {
        ...content.gallery,
        images: newImages
      }
    });
  };

  const handleSocialChange = (index: number, field: keyof Social, value: string) => {
    if (!content) return;
    const updatedSocials = [...content.socials];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [field]: value
    };
    setContent({
      ...content,
      socials: updatedSocials
    });
  };

  const handleRemoveSocial = (index: number) => {
    if (!content) return;
    const updatedSocials = [...content.socials];
    updatedSocials.splice(index, 1);
    setContent({
      ...content,
      socials: updatedSocials
    });
  };

  const handleAddSocial = () => {
    if (!content) return;
    setContent({
      ...content,
      socials: [...content.socials, 
        {
          id: uuidv4(),
          platform: newSocial.platform,
          link: newSocial.link,
          icon: newSocial.platform.toLowerCase()
        }
      ]
    });
    setNewSocial({
      platform: '',
      link: ''
    });
  };

  const handleContactChange = (field: keyof Contact, value: string | boolean) => {
    if (!content) return;
    setContent({
      ...content,
      contact: {
        ...content.contact,
        [field]: value
      }
    });
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    if (!content) return;
    const updatedExperiences = [...content.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setContent({
      ...content,
      experiences: updatedExperiences
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!content) return;
    const updatedExperiences = [...content.experiences];
    updatedExperiences.splice(index, 1);
    setContent({
      ...content,
      experiences: updatedExperiences
    });
  };

  const handleAddExperience = () => {
    if (!content) return;
    if (!newExperience.company || !newExperience.position || !newExperience.duration) {
      setSaveMessage('Please fill in all required fields for the experience');
      return;
    }

    setContent({
      ...content,
      experiences: [
        ...content.experiences,
        {
          ...newExperience,
          id: uuidv4()
        }
      ]
    });

    setNewExperience({
      company: '',
      position: '',
      duration: '',
      description: ''
    });

    setSaveMessage('Experience added! Don\'t forget to save changes.');
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    if (!content) return;
    const updatedProjects = [...content.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    setContent({
      ...content,
      projects: updatedProjects
    });
  };

  const handleRemoveProject = (index: number) => {
    if (!content) return;
    const updatedProjects = [...content.projects];
    updatedProjects.splice(index, 1);
    setContent({
      ...content,
      projects: updatedProjects
    });
  };

  const handleAddProject = () => {
    if (!content) return;
    if (!newProject.title || !newProject.description) {
      setSaveMessage('Please fill in all required fields for the project');
      return;
    }

    setContent({
      ...content,
      projects: [
        ...content.projects,
        {
          ...newProject,
          id: uuidv4()
        }
      ]
    });

    setNewProject({
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '',
      github: ''
    });

    setSaveMessage('Project added! Don\'t forget to save changes.');
  };

  const handleProjectTagChange = (index: number, tags: string) => {
    if (!content) return;
    const updatedProjects = [...content.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    setContent({
      ...content,
      projects: updatedProjects
    });
  };

  const handleNewProjectTagChange = (tags: string) => {
    setNewProject({
      ...newProject,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading authentication state...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-400 text-blue-800 dark:text-blue-400 rounded-md p-4 max-w-md">
          <h2 className="text-lg font-medium mb-2">Authentication Required</h2>
          <p className="mb-4">{authDebug || 'You need to be logged in as an admin to access this page.'}</p>
          <Link
            href="/login?redirectTo=/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
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
                <button
                  onClick={() => setActiveTab('changelog')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'changelog' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Changelog
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'gallery' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Gallery
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

              {activeTab === 'experience' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Experience</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Current Experience</h3>
                      
                      {content.experiences.map((exp, index) => (
                        <div key={exp.id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Position
                              </label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                              placeholder="e.g., Jan 2020 - Present"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={4}
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRemoveExperience(index)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Remove Experience
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Add New Experience</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={newExperience.company}
                            onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                            placeholder="Company name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Position
                          </label>
                          <input
                            type="text"
                            value={newExperience.position}
                            onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                            placeholder="Job title"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={newExperience.duration}
                          onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                          placeholder="e.g., Jan 2020 - Present"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddExperience}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Add Experience
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projects</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Current Projects</h3>
                      
                      {content.projects.map((project, index) => (
                        <div key={project.id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Project Title
                              </label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </label>
                              <textarea
                                rows={4}
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Project Link
                                </label>
                                <input
                                  type="text"
                                  value={project.link}
                                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  GitHub Link
                                </label>
                                <input
                                  type="text"
                                  value={project.github || ''}
                                  onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                                  placeholder="https://github.com/..."
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Technologies (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={project.tags.join(', ')}
                                onChange={(e) => handleProjectTagChange(index, e.target.value)}
                                placeholder="React, Node.js, MongoDB"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Project Image
                              </label>
                              <div className="flex items-center space-x-4">
                                {project.image && (
                                  <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-20 w-20 object-cover rounded-md"
                                  />
                                )}
                                <label className="flex-1">
                                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400">
                                    <div className="space-y-1 text-center">
                                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-indigo-600 dark:text-indigo-400">Upload a file</span> or drag and drop
                                      </div>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'projects', `${index}`)}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => handleRemoveProject(index)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Remove Project
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Add New Project</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                            placeholder="Project name"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={4}
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            placeholder="Describe your project..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Project Link
                            </label>
                            <input
                              type="text"
                              value={newProject.link}
                              onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                              placeholder="https://..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              GitHub Link
                            </label>
                            <input
                              type="text"
                              value={newProject.github}
                              onChange={(e) => setNewProject({...newProject, github: e.target.value})}
                              placeholder="https://github.com/..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Technologies (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={newProject.tags.join(', ')}
                            onChange={(e) => handleNewProjectTagChange(e.target.value)}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Project Image
                          </label>
                          <div className="flex items-center space-x-4">
                            {newProject.image && (
                              <img
                                src={newProject.image}
                                alt="New project"
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            )}
                            <label className="flex-1">
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400">
                                <div className="space-y-1 text-center">
                                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="text-indigo-600 dark:text-indigo-400">Upload a file</span> or drag and drop
                                  </div>
                                </div>
                              </div>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => {
                                  handleImageUpload(e, 'projects', 'new').then(url => {
                                    if (url) {
                                      setNewProject({...newProject, image: url});
                                    }
                                  });
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleAddProject}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            Add Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'socials' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Current Social Links</h3>
                      
                      {content?.socials.map((social, index) => (
                        <div key={social.id} className="flex items-center space-x-2 mb-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Platform
                              </label>
                              <input
                                type="text"
                                value={social.platform}
                                onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Link
                              </label>
                              <input
                                type="text"
                                value={social.link}
                                onChange={(e) => handleSocialChange(index, 'link', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => handleRemoveSocial(index)}
                                className="px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Add New Social Link</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Platform
                          </label>
                          <select
                            value={newSocial.platform}
                            onChange={(e) => setNewSocial({...newSocial, platform: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="">Select Platform</option>
                            <option value="GitHub">GitHub</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Signal">Signal</option>
                            <option value="Telegram">Telegram</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Link
                          </label>
                          <input
                            type="text"
                            value={newSocial.link}
                            onChange={(e) => setNewSocial({...newSocial, link: e.target.value})}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleAddSocial}
                            className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                          >
                            Add Social Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={content.contact.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={content.contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Include country code for international format
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={content.contact.address}
                        onChange={(e) => handleContactChange('address', e.target.value)}
                        placeholder="Your address or location"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Contact Display Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showEmail"
                            checked={content.contact.showEmail !== false}
                            onChange={(e) => handleContactChange('showEmail', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="showEmail" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Display email address publicly
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showPhone"
                            checked={content.contact.showPhone === true}
                            onChange={(e) => handleContactChange('showPhone', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="showPhone" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Display phone number publicly
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showAddress"
                            checked={content.contact.showAddress !== false}
                            onChange={(e) => handleContactChange('showAddress', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="showAddress" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Display address publicly
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'changelog' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Manage Changelog</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Add New Update</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={newChangelogItem.date}
                            onChange={(e) => handleChangelogItemChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Version
                          </label>
                          <input
                            type="text"
                            value={newChangelogItem.version}
                            onChange={(e) => handleChangelogItemChange('version', e.target.value)}
                            placeholder="e.g. 1.2.0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newChangelogItem.title}
                          onChange={(e) => handleChangelogItemChange('title', e.target.value)}
                          placeholder="e.g. New Features & Improvements"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Changes
                        </label>
                        
                        <div className="space-y-2">
                          {newChangelogItem.changes.map((change, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={change}
                                onChange={(e) => handleChangelogChangeText(index, e.target.value)}
                                placeholder="e.g. Added new feature"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveChangelogChange(index)}
                                className="ml-2 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                disabled={newChangelogItem.changes.length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={handleAddChangelogChange}
                            className="mt-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Add Change
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleAddChangelogItem}
                        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                      >
                        Add to Changelog
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Current Changelog ({content.changelog.length} items)</h3>
                    
                    <div className="space-y-4">
                      {content.changelog.map((item, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">{item.title}</h4>
                              <div className="flex items-center mt-1 space-x-3">
                                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs px-2 py-1 rounded-full">
                                  v{item.version}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <ul className="space-y-1 mt-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {item.changes.map((change, changeIndex) => (
                              <li key={changeIndex}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Photo Gallery</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gallery Title
                      </label>
                      <input
                        type="text"
                        value={content.gallery?.title || ''}
                        onChange={(e) => handleGalleryChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gallery Description
                      </label>
                      <textarea
                        rows={3}
                        value={content.gallery?.description || ''}
                        onChange={(e) => handleGalleryChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gallery Images
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {content.gallery?.images?.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`}
                              className="h-32 w-full object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveGalleryImage(index)}
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
                            onChange={(e) => handleImageUpload(e, 'gallery', 'images')}
                          />
                        </label>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tip: Images in the gallery will appear in a slider and can be viewed in a grid layout by visitors.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 