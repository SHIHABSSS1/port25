import { ChangelogItem } from '../data/changelog';

export interface Hero {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
}

export interface About {
  title: string;
  description: string;
  photo: string;
  skills: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
}

export interface Social {
  id: string;
  platform: string;
  link: string;
  icon: string;
}

export interface Contact {
  email: string;
  phone: string;
  address: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export interface SiteContent {
  hero: Hero;
  about: About;
  experiences: Experience[];
  projects: Project[];
  socials: Social[];
  contact: Contact;
  changelog: ChangelogItem[];
} 