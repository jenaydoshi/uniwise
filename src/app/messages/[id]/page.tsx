'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMenteeUser, isMentorUser } from '@/context/AuthContext';
import { ChatMessage, MentorUser, MenteeUser, Connection } from '@/lib/types';
import { 
  getMentorWithProfile, 
  getMenteeWithProfile, 
  getConnectionByUsers,
  getMessagesByConnection,
  createMessage,
  markMessagesAsRead,
  flagMessage
} from '@/lib/utils';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<MentorUser | MenteeUser | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [flaggingMessageId, setFlaggingMessageId] = useState<string | null>(null);
  const [showFlagSuccess, setShowFlagSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = () => {
    if (!user) return;

    // Find the other user
    let other: MentorUser | MenteeUser | null = null;
    let conn: Connection | null = null;

    if (isMenteeUser(user)) {
      other = getMentorWithProfile(id);
      if (other) {
        conn = getConnectionByUsers(user.id, id);
      }
    } else if (isMentorUser(user)) {
      other = getMenteeWithProfile(id);
      if (other) {
        conn = getConnectionByUsers(id, user.id);
      }
    }

    if (!other || !conn || conn.status !== 'accepted') {
      router.push('/messages');
      return;
    }

    setOtherUser(other);
    setConnection(conn);

    // Load messages
    const msgs = getMessagesByConnection(conn.id);
    setMessages(msgs);

    // Mark messages as read
    markMessagesAsRead(conn.id, user.id);

    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !connection || !newMessage.trim()) return;

    const msg = createMessage({
      connectionId: connection.id,
      senderId: user.id,
      text: newMessage.trim(),
      read: false
    });

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleFlagMessage = (messageId: string) => {
    flagMessage(messageId, 'Reported by user for review');
    setFlaggingMessageId(null);
    setShowFlagSuccess(true);
    // Refresh messages to show flagged status
    if (connection) {
      const msgs = getMessagesByConnection(connection.id);
      setMessages(msgs);
    }
    // Hide success message after 3 seconds
    setTimeout(() => setShowFlagSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !otherUser || !connection) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Flag Success Notification */}
      {showFlagSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Message reported. Admin will review it.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4">
        <Link href="/messages" className="text-gray-600 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{otherUser.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
            <p className="text-xs text-gray-500">
              {'profile' in otherUser && 'college' in otherUser.profile 
                ? otherUser.profile.college 
                : 'profile' in otherUser && 'class' in otherUser.profile 
                  ? `Class ${otherUser.profile.class}`
                  : ''}
            </p>
          </div>
        </div>
        <div className="flex-1"></div>
        <Link
          href={isMenteeUser(user) ? `/mentors/${otherUser.id}` : `/mentor/mentees`}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          View Profile
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user.id;
              const showDate = index === 0 || 
                new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`max-w-[70%] ${isMe ? 'order-1' : ''} relative`}>
                      {/* Flag button - only show for messages from the other person */}
                      {!isMe && !msg.flagged && (
                        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition`}>
                          {flaggingMessageId === msg.id ? (
                            <div className="flex items-center space-x-1 bg-white shadow-lg rounded-lg p-1">
                              <button
                                onClick={() => handleFlagMessage(msg.id)}
                                className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                title="Confirm report"
                              >
                                Report
                              </button>
                              <button
                                onClick={() => setFlaggingMessageId(null)}
                                className="p-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setFlaggingMessageId(msg.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition"
                              title="Report this message"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-md'
                            : msg.flagged
                              ? 'bg-red-50 text-gray-900 rounded-bl-md shadow-sm border border-red-200'
                              : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        {msg.flagged && (
                          <p className="text-xs text-red-500 mt-1">🚩 Reported</p>
                        )}
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : ''}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">{otherUser.name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Start a conversation</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              This is the beginning of your conversation with {otherUser.name.split(' ')[0]}.
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 bg-white"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}
