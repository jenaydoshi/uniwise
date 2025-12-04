'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MentorUser } from '@/lib/types';
import { getMentorWithProfile, getConnectionByUsers, createConnection, updateConnection } from '@/lib/utils';

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [mentor, setMentor] = useState<MentorUser | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');

  useEffect(() => {
    loadMentor();
  }, [id, user]);

  const loadMentor = () => {
    const mentorData = getMentorWithProfile(id);
    if (!mentorData) {
      router.push('/mentors');
      return;
    }
    setMentor(mentorData);

    // Check connection status
    if (user && user.role === 'mentee') {
      const connection = getConnectionByUsers(user.id, id);
      if (connection) {
        setConnectionStatus(connection.status === 'accepted' ? 'accepted' : connection.status === 'pending' ? 'pending' : 'none');
      }
    }

    setLoading(false);
  };

  const handleConnect = () => {
    if (!user || user.role !== 'mentee') {
      router.push('/login');
      return;
    }

    // Create connection request
    createConnection({
      menteeId: user.id,
      mentorId: id,
      status: 'pending',
      message: connectMessage || `Hi! I'm ${user.name} and I'd love to connect with you for mentorship.`
    });

    setConnectionStatus('pending');
    setShowConnectModal(false);

    // Auto-accept for MVP demo
    setTimeout(() => {
      const conn = getConnectionByUsers(user.id, id);
      if (conn) {
        updateConnection(conn.id, { status: 'accepted' });
        setConnectionStatus('accepted');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!mentor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/mentors" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Mentors
        </Link>
      </div>

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {mentor.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                      {mentor.profile.verificationBadge && (
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-indigo-600 font-medium">{mentor.profile.college}</p>
                    <p className="text-gray-500">
                      {mentor.profile.major}
                      {mentor.profile.minor && ` • Minor: ${mentor.profile.minor}`}
                      {' • '}
                      {mentor.profile.year === 'graduated' ? 'Graduated' : `${mentor.profile.year} year`}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-3">
                    {connectionStatus === 'none' && (
                      <button
                        onClick={() => setShowConnectModal(true)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        Connect
                      </button>
                    )}
                    {connectionStatus === 'pending' && (
                      <button
                        disabled
                        className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                      >
                        Request Sent
                      </button>
                    )}
                    {connectionStatus === 'accepted' && (
                      <Link
                        href={`/messages/${mentor.id}`}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        Send Message
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{mentor.profile.bio}</p>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Can Help With</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.profile.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {mentor.profile.faqs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {mentor.profile.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {mentor.profile.city}, {mentor.profile.state}
                </div>
                <div className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{mentor.profile.languages.join(', ')}</span>
                </div>
                {mentor.profile.availability && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mentor.profile.availability}
                  </div>
                )}
              </div>
            </div>

            {/* Verification */}
            {mentor.profile.verificationBadge && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Verified Student</h3>
                    <p className="text-sm text-green-700 mt-1">
                      This mentor&apos;s enrollment at {mentor.profile.college} has been verified.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowConnectModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connect with {mentor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send a personalized message to introduce yourself and explain why you&apos;d like to connect.
                </p>
                <textarea
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Hi ${mentor.name}! I'm preparing for... and I'd love your guidance on...`}
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConnect}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
