export interface ChangelogItem {
  date: string;
  version: string;
  title: string;
  changes: string[];
}

export const changelog: ChangelogItem[] = [
  {
    date: '2023-04-15',
    version: '1.1.0',
    title: 'Performance & Reliability Improvements',
    changes: [
      'Fixed Firebase permissions issues',
      'Added image loading fallbacks for better reliability',
      'Improved error handling throughout the application',
      'Optimized images for faster loading',
      'Added CORS support for better API communication'
    ]
  },
  {
    date: '2023-04-10',
    version: '1.0.0',
    title: 'Initial Release',
    changes: [
      'Launched portfolio website',
      'Added hero section with image carousel',
      'Created about section with skills',
      'Implemented projects showcase',
      'Added contact form functionality'
    ]
  }
]; 