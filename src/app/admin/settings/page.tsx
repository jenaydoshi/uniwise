'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { resetData } from '@/lib/utils';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    setLoading(false);
  }, [user, router]);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This will restore the sample data and cannot be undone.')) {
      resetData();
      alert('Data has been reset to sample data. Please refresh the page.');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !isAdminUser(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Platform configuration and data management</p>
        </div>

        <div className="space-y-6">
          {/* Platform Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Name</span>
                <span className="font-medium">UniWise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">1.0.0 (MVP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data Storage</span>
                <span className="font-medium">LocalStorage (Browser)</span>
              </div>
            </div>
          </div>

          {/* Admin Account */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Account</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Credentials</h2>
            <p className="text-sm text-gray-500 mb-4">Use these credentials to test different user roles:</p>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Mentee Account</p>
                <p className="text-sm text-gray-600">ravi.kumar@gmail.com / password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Mentor Account</p>
                <p className="text-sm text-gray-600">arjun.sharma@iitb.ac.in / password123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Admin Account</p>
                <p className="text-sm text-gray-600">admin@uniwise.com / admin123</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reset All Data</p>
                  <p className="text-sm text-gray-500">This will reset all data to the initial sample data.</p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
