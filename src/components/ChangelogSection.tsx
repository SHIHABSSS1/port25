'use client';

import React, { useState } from 'react';
import { changelog } from '../data/changelog';
import { motion } from 'framer-motion';

interface ChangelogSectionProps {
  initialItemsToShow?: number;
}

const ChangelogSection: React.FC<ChangelogSectionProps> = ({ initialItemsToShow = 1 }) => {
  const [expanded, setExpanded] = useState(false);
  
  const itemsToDisplay = expanded ? changelog : changelog.slice(0, initialItemsToShow);
  
  return (
    <section id="changelog" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Latest Updates
          </motion.h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto mt-2"></div>
        </div>
        
        <div className="space-y-6">
          {itemsToDisplay.map((item, index) => (
            <motion.div
              key={item.version}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
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
              
              <ul className="space-y-2 mt-4 list-disc list-inside text-gray-700 dark:text-gray-300">
                {item.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {changelog.length > initialItemsToShow && (
          <div className="text-center mt-8">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all"
            >
              {expanded ? 'Show Less' : 'View All Updates'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChangelogSection; 