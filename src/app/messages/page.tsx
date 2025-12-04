'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMenteeUser, isMentorUser } from '@/context/AuthContext';
import { Connection, User, MentorUser, MenteeUser } from '@/lib/types';
import { getConnections, getMentorWithProfile, getMenteeWithProfile, getMessagesByConnection } from '@/lib/utils';

interface ConversationPreview {
  connection: Connection;
  otherUser: MentorUser | MenteeUser;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadConversations = () => {
    if (!user) return;

    const allConnections = getConnections();
    let myConnections: Connection[];

    if (isMenteeUser(user)) {
      myConnections = allConnections.filter(c => c.menteeId === user.id && c.status === 'accepted');
    } else if (isMentorUser(user)) {
      myConnections = allConnections.filter(c => c.mentorId === user.id && c.status === 'accepted');
    } else {
      myConnections = [];
    }

    const convPreviews: ConversationPreview[] = [];

    myConnections.forEach(conn => {
      let otherUser: MentorUser | MenteeUser | null = null;
      
      if (isMenteeUser(user)) {
        otherUser = getMentorWithProfile(conn.mentorId);
      } else if (isMentorUser(user)) {
        otherUser = getMenteeWithProfile(conn.menteeId);
      }

      if (otherUser) {
        const messages = getMessagesByConnection(conn.id);
        const lastMsg = messages[messages.length - 1];
        const unreadCount = messages.filter(m => !m.read && m.senderId !== user.id).length;

        convPreviews.push({
          connection: conn,
          otherUser,
          lastMessage: lastMsg?.text,
          lastMessageTime: lastMsg?.createdAt,
          unreadCount
        });
      }
    });

    // Sort by most recent message
    convPreviews.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0;
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    setConversations(convPreviews);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {isMenteeUser(user) ? 'Chat with your mentors' : 'Chat with your mentees'}
          </p>
        </div>

        {/* Conversations List */}
        {conversations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {conversations.map(({ connection, otherUser, lastMessage, lastMessageTime, unreadCount }) => (
              <Link
                key={connection.id}
                href={`/messages/${otherUser.id}`}
                className="block hover:bg-gray-50 transition"
              >
                <div className="p-4 flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{otherUser.name.charAt(0)}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {otherUser.name}
                      </h3>
                      {lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {'profile' in otherUser && 'college' in otherUser.profile 
                        ? otherUser.profile.college 
                        : 'profile' in otherUser && 'class' in otherUser.profile 
                          ? `Class ${otherUser.profile.class}`
                          : ''}
                    </p>
                    {lastMessage && (
                      <p className={`text-sm truncate mt-1 ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {lastMessage}
                      </p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No conversations yet</h3>
            <p className="mt-2 text-gray-500">
              {isMenteeUser(user) 
                ? 'Connect with mentors to start chatting'
                : 'Accept connection requests to start chatting with mentees'}
            </p>
            <Link
              href={isMenteeUser(user) ? '/mentors' : '/mentor/requests'}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isMenteeUser(user) ? 'Find Mentors' : 'View Requests'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}
