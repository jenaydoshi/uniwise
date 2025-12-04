'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMentorUser } from '@/context/AuthContext';
import { Connection, MenteeUser } from '@/lib/types';
import { getConnections, getMenteeWithProfile, getMessagesByConnection } from '@/lib/utils';

export default function MentorMenteesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentees, setMentees] = useState<{ connection: Connection; mentee: MenteeUser; unreadCount: number }[]>([]);
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
    const myConnections = allConnections.filter(c => c.mentorId === user.id && c.status === 'accepted');

    const menteesWithInfo: { connection: Connection; mentee: MenteeUser; unreadCount: number }[] = [];
    myConnections.forEach(conn => {
      const mentee = getMenteeWithProfile(conn.menteeId);
      if (mentee) {
        const messages = getMessagesByConnection(conn.id);
        const unreadCount = messages.filter(m => !m.read && m.senderId !== user.id).length;
        menteesWithInfo.push({ connection: conn, mentee, unreadCount });
      }
    });
    
    // Sort by most recent activity
    menteesWithInfo.sort((a, b) => new Date(b.connection.updatedAt).getTime() - new Date(a.connection.updatedAt).getTime());
    
    setMentees(menteesWithInfo);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/mentor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Your Mentees</h1>
            <p className="text-gray-600 mt-1">Students you&apos;re currently mentoring</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold text-indigo-600">{mentees.length}</p>
          </div>
        </div>

        {/* Mentees List */}
        {mentees.length > 0 ? (
          <div className="space-y-4">
            {mentees.map(({ connection, mentee, unreadCount }) => (
              <div key={connection.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{mentee.name.charAt(0)}</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{mentee.name}</h3>
                      <p className="text-gray-500 text-sm">{mentee.email}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {mentee.profile?.class === 'gap_year' ? 'Gap Year' : `Class ${mentee.profile?.class}`}
                        </span>
                        {mentee.profile?.exams?.slice(0, 2).map(exam => (
                          <span key={exam} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {exam}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">
                      Connected {new Date(connection.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/messages/${mentee.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      {unreadCount > 0 ? `Message (${unreadCount})` : 'Message'}
                    </Link>
                  </div>
                </div>

                {/* Mentee Details - Expandable */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {mentee.profile?.targetColleges && mentee.profile.targetColleges.length > 0 && (
                      <div>
                        <p className="text-gray-500">Target Colleges:</p>
                        <p className="text-gray-900">{mentee.profile.targetColleges.join(', ')}</p>
                      </div>
                    )}
                    {mentee.profile?.city && mentee.profile?.state && (
                      <div>
                        <p className="text-gray-500">Location:</p>
                        <p className="text-gray-900">{mentee.profile.city}, {mentee.profile.state}</p>
                      </div>
                    )}
                  </div>
                  {mentee.profile?.goalsText && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Goals:</p>
                      <p className="text-gray-700 text-sm mt-1">{mentee.profile.goalsText}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No mentees yet</h3>
            <p className="mt-2 text-gray-500">
              Once you accept connection requests, your mentees will appear here.
            </p>
            <Link
              href="/mentor/requests"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              View Requests
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
