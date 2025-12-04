'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMentorUser } from '@/context/AuthContext';
import { Connection, MenteeUser } from '@/lib/types';
import { getConnections, getMenteeWithProfile, updateConnection } from '@/lib/utils';

export default function MentorRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<{ connection: Connection; mentee: MenteeUser }[]>([]);
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
    setLoading(false);
  };

  const handleAccept = (connectionId: string) => {
    updateConnection(connectionId, { status: 'accepted' });
    setPendingRequests(prev => prev.filter(r => r.connection.id !== connectionId));
  };

  const handleReject = (connectionId: string) => {
    updateConnection(connectionId, { status: 'rejected' });
    setPendingRequests(prev => prev.filter(r => r.connection.id !== connectionId));
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
            <h1 className="text-3xl font-bold text-gray-900">Connection Requests</h1>
            <p className="text-gray-600 mt-1">Review and respond to mentee requests</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-indigo-600">{pendingRequests.length}</p>
          </div>
        </div>

        {/* Requests List */}
        {pendingRequests.length > 0 ? (
          <div className="space-y-6">
            {pendingRequests.map(({ connection, mentee }) => (
              <div key={connection.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl font-bold">{mentee.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{mentee.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(connection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{mentee.email}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {mentee.profile?.class === 'gap_year' ? 'Gap Year' : `Class ${mentee.profile?.class}`}
                        </span>
                        {mentee.profile?.exams?.slice(0, 2).map(exam => (
                          <span key={exam} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {exam}
                          </span>
                        ))}
                        {mentee.profile?.city && mentee.profile?.state && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            📍 {mentee.profile.city}, {mentee.profile.state}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message from mentee */}
                  {connection.message && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Message from {mentee.name.split(' ')[0]}:</p>
                      <p className="text-gray-700">{connection.message}</p>
                    </div>
                  )}

                  {/* Goals */}
                  {mentee.profile?.goalsText && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Their Goals:</p>
                      <p className="text-gray-700 text-sm">{mentee.profile.goalsText}</p>
                    </div>
                  )}

                  {/* Target Colleges */}
                  {mentee.profile?.targetColleges && mentee.profile.targetColleges.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Target Colleges:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentee.profile.targetColleges.map(college => (
                          <span key={college} className="text-sm text-indigo-600">{college}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleReject(connection.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(connection.id)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
            <p className="mt-2 text-gray-500">
              When students request to connect with you, they&apos;ll appear here.
            </p>
            <Link
              href="/mentor/dashboard"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
