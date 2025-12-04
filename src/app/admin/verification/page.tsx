'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { MentorProfile, User } from '@/lib/types';
import { getMentorProfiles, getUserById, updateMentorProfile } from '@/lib/utils';

interface MentorWithUser extends MentorProfile {
  user: User | null;
}

export default function AdminVerificationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorWithUser[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
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
    loadMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadMentors = () => {
    const profiles = getMentorProfiles();
    const mentorsWithUsers: MentorWithUser[] = profiles.map(profile => ({
      ...profile,
      user: getUserById(profile.userId)
    }));
    setMentors(mentorsWithUsers);
    setLoading(false);
  };

  const handleVerify = (userId: string) => {
    updateMentorProfile(userId, { 
      verificationStatus: 'verified',
      verificationBadge: true 
    });
    loadMentors();
  };

  const handleReject = (userId: string) => {
    updateMentorProfile(userId, { 
      verificationStatus: 'rejected',
      verificationBadge: false 
    });
    loadMentors();
  };

  const handleReset = (userId: string) => {
    updateMentorProfile(userId, { 
      verificationStatus: 'pending',
      verificationBadge: false 
    });
    loadMentors();
  };

  const filteredMentors = mentors.filter(m => {
    if (filter === 'all') return true;
    return m.verificationStatus === filter;
  });

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

  const statusCounts = {
    all: mentors.length,
    pending: mentors.filter(m => m.verificationStatus === 'pending').length,
    verified: mentors.filter(m => m.verificationStatus === 'verified').length,
    rejected: mentors.filter(m => m.verificationStatus === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Verification</h1>
          <p className="text-gray-600 mt-1">Review and verify mentor applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-2">
          {(['pending', 'verified', 'rejected', 'all'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {/* Mentors List */}
        {filteredMentors.length > 0 ? (
          <div className="space-y-4">
            {filteredMentors.map(mentor => (
              <div key={mentor.userId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-bold">
                          {mentor.user?.name.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {mentor.user?.name || 'Unknown'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mentor.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800'
                              : mentor.verificationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {mentor.verificationStatus}
                          </span>
                        </div>
                        <p className="text-gray-600">{mentor.user?.email}</p>
                        <p className="text-indigo-600 font-medium mt-1">{mentor.college}</p>
                        <p className="text-gray-500 text-sm">
                          {mentor.major}{mentor.minor && ` • Minor: ${mentor.minor}`} • {mentor.year} year
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {mentor.verificationStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReject(mentor.userId)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleVerify(mentor.userId)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Verify
                          </button>
                        </>
                      )}
                      {mentor.verificationStatus === 'verified' && (
                        <button
                          onClick={() => handleReset(mentor.userId)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                          Reset to Pending
                        </button>
                      )}
                      {mentor.verificationStatus === 'rejected' && (
                        <button
                          onClick={() => handleVerify(mentor.userId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{mentor.city}, {mentor.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Languages</p>
                      <p className="text-gray-900">{mentor.languages.join(', ')}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Topics</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentor.topics.map(topic => (
                          <span key={topic} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-700 text-sm mt-1">{mentor.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No {filter} mentors</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'pending' ? 'All mentor applications have been reviewed.' : `No mentors with ${filter} status.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
