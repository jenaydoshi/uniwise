'use client';

import Link from 'next/link';
import { MentorUser } from '@/lib/types';

interface MentorCardProps {
  mentor: MentorUser;
  connectionStatus?: 'none' | 'pending' | 'accepted';
  onConnect?: () => void;
}

export default function MentorCard({ mentor, connectionStatus = 'none', onConnect }: MentorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {mentor.name.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {mentor.name}
              </h3>
              {mentor.profile.verificationBadge && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-indigo-600 font-medium">{mentor.profile.college}</p>
            <p className="text-sm text-gray-500">
              {mentor.profile.major} • {mentor.profile.year === 'graduated' ? 'Graduated' : `${mentor.profile.year} year`}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {mentor.profile.bio}
        </p>

        {/* Topics */}
        <div className="mt-4 flex flex-wrap gap-2">
          {mentor.profile.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
            >
              {topic}
            </span>
          ))}
          {mentor.profile.topics.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{mentor.profile.topics.length - 4} more
            </span>
          )}
        </div>

        {/* Languages */}
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {mentor.profile.languages.slice(0, 3).join(', ')}
          {mentor.profile.languages.length > 3 && ` +${mentor.profile.languages.length - 3}`}
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-3">
          <Link
            href={`/mentors/${mentor.id}`}
            className="flex-1 px-4 py-2 text-center border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
          >
            View Profile
          </Link>
          {connectionStatus === 'none' && onConnect && (
            <button
              onClick={onConnect}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Connect
            </button>
          )}
          {connectionStatus === 'pending' && (
            <button
              disabled
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Request Sent
            </button>
          )}
          {connectionStatus === 'accepted' && (
            <Link
              href={`/messages/${mentor.id}`}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition text-center"
            >
              Chat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
