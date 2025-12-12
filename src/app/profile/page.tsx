'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMenteeUser } from '@/context/AuthContext';
import { MentorUser, Connection } from '@/lib/types';
import { getConnections, getMentorWithProfile, updateUser, updateMenteeProfile, getCurrentUser } from '@/lib/utils';

const classOptions = [
  { value: '10', label: '10th Class' },
  { value: '11', label: '11th Class' },
  { value: '12', label: '12th Class' },
  { value: 'gap_year', label: 'Gap Year / Dropper' }
];

const examsList = ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT', 'CLAT', 'NLU Entrance', 'CAT', 'GATE', 'UPSC'];
const collegesList = ['IIT', 'NIT', 'BITS', 'AIIMS', 'NLU', 'IIM', 'IIIT', 'ISI', 'Other'];

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateCurrentUser } = useAuth();
  const [connectedMentors, setConnectedMentors] = useState<MentorUser[]>([]);
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    currentClass: '11' as '10' | '11' | '12' | 'gap_year',
    targetColleges: [] as string[],
    exams: [] as string[],
    interests: [] as string[],
    goalsText: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'mentee') {
      router.push('/mentor/dashboard');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = () => {
    if (!user || !isMenteeUser(user)) return;

    // Load connections
    const allConnections = getConnections();
    const menteeConnections = allConnections.filter(c => c.menteeId === user.id);

    // Get connected mentors
    const accepted = menteeConnections.filter(c => c.status === 'accepted');
    const mentors: MentorUser[] = [];
    accepted.forEach(conn => {
      const mentor = getMentorWithProfile(conn.mentorId);
      if (mentor) mentors.push(mentor);
    });
    setConnectedMentors(mentors);

    // Get pending connections
    const pending = menteeConnections.filter(c => c.status === 'pending');
    setPendingConnections(pending);

    // Set form data
    setFormData({
      name: user.name,
      city: user.profile?.city || '',
      state: user.profile?.state || '',
      currentClass: user.profile?.class || '11',
      targetColleges: user.profile?.targetColleges || [],
      exams: user.profile?.exams || [],
      interests: user.profile?.interests || [],
      goalsText: user.profile?.goalsText || ''
    });

    setLoading(false);
  };

  const handleSave = () => {
    if (!user || !isMenteeUser(user)) return;

    // Update user
    updateUser(user.id, {
      name: formData.name
    });

    // Update profile
    updateMenteeProfile(user.id, {
      city: formData.city,
      state: formData.state,
      class: formData.currentClass,
      targetColleges: formData.targetColleges,
      exams: formData.exams,
      interests: formData.interests,
      goalsText: formData.goalsText
    });

    // Refresh user from storage
    const updatedUser = getCurrentUser();
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
    setIsEditing(false);
  };

  const handleExamToggle = (exam: string) => {
    setFormData(prev => ({
      ...prev,
      exams: prev.exams.includes(exam)
        ? prev.exams.filter((e: string) => e !== exam)
        : [...prev.exams, exam]
    }));
  };

  const handleCollegeToggle = (college: string) => {
    setFormData(prev => ({
      ...prev,
      targetColleges: prev.targetColleges.includes(college)
        ? prev.targetColleges.filter((c: string) => c !== college)
        : [...prev.targetColleges, college]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !isMenteeUser(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-40"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 break-words">{user.name}</h1>
                    <p className="text-gray-500 break-words">{user.email}</p>
                    {user.profile && (
                      <p className="text-indigo-600 font-medium mt-1">
                        {classOptions.find(c => c.value === user.profile?.class)?.label || 'Student'}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition whitespace-nowrap"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                      <select
                        value={formData.currentClass}
                        onChange={(e) => setFormData({ ...formData, currentClass: e.target.value as '10' | '11' | '12' | 'gap_year' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      >
                        {classOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Colleges</label>
                    <div className="flex flex-wrap gap-2">
                      {collegesList.map(college => (
                        <button
                          key={college}
                          type="button"
                          onClick={() => handleCollegeToggle(college)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            formData.targetColleges.includes(college)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {college}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Exams</label>
                    <div className="flex flex-wrap gap-2">
                      {examsList.map(exam => (
                        <button
                          key={exam}
                          type="button"
                          onClick={() => handleExamToggle(exam)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            formData.exams.includes(exam)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {exam}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goals & Aspirations</label>
                    <textarea
                      value={formData.goalsText}
                      onChange={(e) => setFormData({ ...formData, goalsText: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      placeholder="What are your goals? What guidance are you seeking?"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Class</p>
                      <p className="font-medium">
                        {classOptions.find(c => c.value === user.profile?.class)?.label || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {user.profile?.city && user.profile?.state 
                          ? `${user.profile.city}, ${user.profile.state}`
                          : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Target Colleges</p>
                    <div className="flex flex-wrap gap-2">
                      {user.profile?.targetColleges && user.profile.targetColleges.length > 0 ? (
                        user.profile.targetColleges.map(college => (
                          <span key={college} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                            {college}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Target Exams</p>
                    <div className="flex flex-wrap gap-2">
                      {user.profile?.exams && user.profile.exams.length > 0 ? (
                        user.profile.exams.map(exam => (
                          <span key={exam} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                            {exam}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Goals & Aspirations</p>
                    <p className="text-gray-700">
                      {user.profile?.goalsText || 'Not set'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Connected Mentors */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Mentors</h2>
                <Link href="/mentors" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Find More
                </Link>
              </div>
              {connectedMentors.length > 0 ? (
                <div className="space-y-4">
                  {connectedMentors.map(mentor => (
                    <div key={mentor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{mentor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <Link href={`/mentors/${mentor.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                            {mentor.name}
                          </Link>
                          <p className="text-sm text-gray-500">{mentor.profile.college}</p>
                        </div>
                      </div>
                      <Link
                        href={`/messages/${mentor.id}`}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
                      >
                        Message
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect with mentors to get guidance for your journey.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/mentors"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Browse Mentors
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connected Mentors</span>
                  <span className="text-2xl font-bold text-indigo-600">{connectedMentors.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Requests</span>
                  <span className="text-2xl font-bold text-yellow-600">{pendingConnections.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/mentors"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-gray-700">Find Mentors</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-gray-700">Messages</span>
                </Link>
                <Link
                  href="/community"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Community Q&A</span>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-indigo-700">
                Complete your profile to help mentors understand your goals better and get more personalized guidance!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
