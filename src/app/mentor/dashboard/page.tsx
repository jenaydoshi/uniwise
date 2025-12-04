'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMentorUser } from '@/context/AuthContext';
import { Connection, MenteeUser, User } from '@/lib/types';
import { getConnections, getMenteeWithProfile, getMessagesByConnection } from '@/lib/utils';

export default function MentorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<{ connection: Connection; mentee: MenteeUser }[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<{ connection: Connection; mentee: MenteeUser }[]>([]);
  const [stats, setStats] = useState({
    totalMentees: 0,
    pendingRequests: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'mentor') {
      router.push('/');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = () => {
    if (!user || !isMentorUser(user)) return;

    const allConnections = getConnections();
    const myConnections = allConnections.filter(c => c.mentorId === user.id);

    // Get pending requests with mentee info
    const pending = myConnections.filter(c => c.status === 'pending');
    const pendingWithMentees: { connection: Connection; mentee: MenteeUser }[] = [];
    pending.forEach(conn => {
      const mentee = getMenteeWithProfile(conn.menteeId);
      if (mentee) {
        pendingWithMentees.push({ connection: conn, mentee });
      }
    });
    setPendingRequests(pendingWithMentees);

    // Get accepted connections
    const accepted = myConnections.filter(c => c.status === 'accepted');
    const acceptedWithMentees: { connection: Connection; mentee: MenteeUser }[] = [];
    accepted.forEach(conn => {
      const mentee = getMenteeWithProfile(conn.menteeId);
      if (mentee) {
        acceptedWithMentees.push({ connection: conn, mentee });
      }
    });
    setAcceptedConnections(acceptedWithMentees);

    // Count unread messages
    let unreadCount = 0;
    accepted.forEach(conn => {
      const messages = getMessagesByConnection(conn.id);
      unreadCount += messages.filter((m) => !m.read && m.senderId !== user.id).length;
    });

    setStats({
      totalMentees: accepted.length,
      pendingRequests: pending.length,
      unreadMessages: unreadCount
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

  if (!user || !isMentorUser(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your mentees</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Mentees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMentees}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        {!user.profile.verificationBadge && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Verification Pending</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your profile is under review. Once verified, you&apos;ll receive a verification badge that helps mentees trust your profile.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
                {pendingRequests.length > 0 && (
                  <Link href="/mentor/requests" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    View All
                  </Link>
                )}
              </div>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 3).map(({ connection, mentee }) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{mentee.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mentee.name}</p>
                          <p className="text-sm text-gray-500">
                            {mentee.profile?.class === 'gap_year' ? 'Gap Year' : `Class ${mentee.profile?.class}`}
                            {mentee.profile?.exams && mentee.profile.exams.length > 0 && ` • ${mentee.profile.exams[0]}`}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/mentor/requests"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-2 text-gray-500">No pending requests</p>
                </div>
              )}
            </div>

            {/* Recent Mentees */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Mentees</h2>
                {acceptedConnections.length > 0 && (
                  <Link href="/mentor/mentees" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    View All
                  </Link>
                )}
              </div>
              {acceptedConnections.length > 0 ? (
                <div className="space-y-4">
                  {acceptedConnections.slice(0, 3).map(({ connection, mentee }) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{mentee.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mentee.name}</p>
                          <p className="text-sm text-gray-500">
                            Connected {new Date(connection.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/messages/${mentee.id}`}
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
                  <p className="mt-2 text-gray-500">No mentees yet</p>
                  <p className="text-sm text-gray-400">New mentees will appear here once they connect with you</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{user.name.charAt(0)}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-indigo-600">{user.profile.college}</p>
                <div className="flex items-center justify-center mt-2">
                  {user.profile.verificationBadge ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Verification
                    </span>
                  )}
                </div>
                <Link
                  href="/mentor/edit-profile"
                  className="mt-4 inline-block px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/messages"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-gray-700">Messages</span>
                  {stats.unreadMessages > 0 && (
                    <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      {stats.unreadMessages}
                    </span>
                  )}
                </Link>
                <Link
                  href="/mentor/requests"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-gray-700">Connection Requests</span>
                  {stats.pendingRequests > 0 && (
                    <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      {stats.pendingRequests}
                    </span>
                  )}
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
              <h3 className="font-semibold text-indigo-900 mb-2">🎯 Mentor Tip</h3>
              <p className="text-sm text-indigo-700">
                Respond to connection requests promptly and answer community questions to increase your visibility and help more students!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
