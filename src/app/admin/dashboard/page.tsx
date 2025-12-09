'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { 
  getUsers, 
  getMentorProfiles, 
  getMenteeProfiles, 
  getConnections, 
  getMessages,
  getThreads,
  getAnswers,
  getFlags
} from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    pendingVerifications: 0,
    totalConnections: 0,
    totalMessages: 0,
    totalThreads: 0,
    totalAnswers: 0,
    flaggedContent: 0
  });
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
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadStats = () => {
    const users = getUsers();
    const mentorProfiles = getMentorProfiles();
    const menteeProfiles = getMenteeProfiles();
    const connections = getConnections();
    const messages = getMessages();
    const threads = getThreads();
    const answers = getAnswers();
    const flags = getFlags().filter(f => f.targetType === 'thread' || f.targetType === 'answer');

    const pendingVerifications = mentorProfiles.filter(m => m.verificationStatus === 'pending').length;

    setStats({
      totalUsers: users.length,
      totalMentors: mentorProfiles.length,
      totalMentees: menteeProfiles.length,
      pendingVerifications,
      totalConnections: connections.filter(c => c.status === 'accepted').length,
      totalMessages: messages.length,
      totalThreads: threads.length,
      totalAnswers: answers.length,
      flaggedContent: flags.length
    });

    setLoading(false);
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

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Mentors', value: stats.totalMentors, icon: '🎓', color: 'bg-green-500' },
    { label: 'Mentees', value: stats.totalMentees, icon: '📚', color: 'bg-purple-500' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'Active Connections', value: stats.totalConnections, icon: '🤝', color: 'bg-indigo-500' },
    { label: 'Messages Sent', value: stats.totalMessages, icon: '💬', color: 'bg-pink-500' },
    { label: 'Q&A Threads', value: stats.totalThreads, icon: '❓', color: 'bg-teal-500' },
    { label: 'Answers', value: stats.totalAnswers, icon: '✅', color: 'bg-orange-500' },
    { label: 'Flagged Q&A', value: stats.flaggedContent, icon: '🚩', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of UniWise platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Verification Queue */}
          <Link href="/admin/verification" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mentor Verification</h3>
                  <p className="text-sm text-gray-500">
                    {stats.pendingVerifications} pending {stats.pendingVerifications === 1 ? 'request' : 'requests'}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* User Management */}
          <Link href="/admin/users" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-500">{stats.totalUsers} total users</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Community Moderation */}
          <Link href="/admin/community" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community Q&A</h3>
                  <p className="text-sm text-gray-500">{stats.totalThreads} threads, {stats.totalAnswers} answers</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Flagged Content */}
          <Link href="/admin/community?view=flags" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Flagged Q&amp;A</h3>
                  <p className="text-sm text-gray-500">{stats.flaggedContent} flagged item{stats.flaggedContent === 1 ? '' : 's'}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Connections */}
          <Link href="/admin/connections" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Connections</h3>
                  <p className="text-sm text-gray-500">{stats.totalConnections} active connections</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Messages Overview */}
          <Link href="/admin/messages" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-500">{stats.totalMessages} total messages</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/admin/settings" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-500">Platform configuration</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
