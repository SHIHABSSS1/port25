'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { signIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  useEffect(() => {
    // Only redirect automatically if we're not coming from the admin page
    if (user && redirectTo !== '/admin') {
      setDebugInfo(`User authenticated. Redirecting to: ${redirectTo}`);
      
      // Force a small delay to ensure state is properly updated
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setLoading(true);
    
    try {
      await signIn(email, password);
      setDebugInfo('Login successful, waiting for redirect...');
    } catch (error: unknown) {
      let errorMessage = 'Failed to login';
      
      // Handle Firebase error codes
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        
        if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Invalid email or password';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email format';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed login attempts. Please try again later.';
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manual navigation to admin if user is already authenticated
  const goToAdmin = () => {
    router.push('/admin');
  };

  // DEV ONLY: Set current user as admin
  const setAsAdmin = async () => {
    if (!user) {
      setDebugInfo('You must be logged in to set admin role');
      return;
    }
    
    try {
      setDebugInfo('Setting user as admin...');
      // Update the user document in Firestore with admin role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin'
      }, { merge: true });
      
      setDebugInfo('Admin role set successfully! Please refresh the page or log in again for changes to take effect.');
    } catch (error) {
      console.error('Error setting admin role:', error);
      setDebugInfo('Error setting admin role. See console for details.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the admin panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {user ? (
            <div className="text-center">
              <p className="mb-4 text-green-600 dark:text-green-400">You are already logged in.</p>
              <button
                onClick={goToAdmin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
              >
                Go to Admin Panel
              </button>
              
              {/* DEV ONLY: Button to set current user as admin */}
              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Development Tools</p>
                <button
                  onClick={setAsAdmin}
                  className="w-full flex justify-center py-2 px-4 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none"
                >
                  Set as Admin (Development Only)
                </button>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  This will set your current user account as an admin in Firestore.
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-800 dark:text-red-400 rounded-md p-3 mb-4">
                  <p>{error}</p>
                </div>
              )}
              
              {debugInfo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-400 text-blue-800 dark:text-blue-400 rounded-md p-3 mb-4">
                  <p>{debugInfo}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 