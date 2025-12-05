'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { ChatMessage, User, Connection } from '@/lib/types';
import { 
  getMessages, 
  getConnections, 
  getUserById, 
  flagMessage, 
  unflagMessage, 
  deleteMessage,
  getFlaggedMessages,
  formatDate
} from '@/lib/utils';

interface MessageWithDetails extends ChatMessage {
  sender: User | null;
  connection: Connection | null;
  otherUser: User | null;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithDetails[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged'>('flagged');
  const [loading, setLoading] = useState(true);
  const [flagReason, setFlagReason] = useState('');
  const [flaggingMessageId, setFlaggingMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadMessages = () => {
    const allMessages = filter === 'flagged' ? getFlaggedMessages() : getMessages();
    const connections = getConnections();
    
    const messagesWithDetails: MessageWithDetails[] = allMessages.map(msg => {
      const sender = getUserById(msg.senderId);
      const connection = connections.find(c => c.id === msg.connectionId) || null;
      let otherUser: User | null = null;
      if (connection) {
        const otherUserId = msg.senderId === connection.menteeId ? connection.mentorId : connection.menteeId;
        otherUser = getUserById(otherUserId);
      }
      return { ...msg, sender, connection, otherUser };
    });

    // Sort by date, most recent first
    messagesWithDetails.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setMessages(messagesWithDetails);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleFlag = (messageId: string) => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }
    flagMessage(messageId, flagReason);
    setFlagReason('');
    setFlaggingMessageId(null);
    loadMessages();
  };

  const handleUnflag = (messageId: string) => {
    unflagMessage(messageId);
    loadMessages();
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      deleteMessage(messageId);
      loadMessages();
    }
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

  const flaggedCount = getMessages().filter(m => m.flagged).length;

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
          <h1 className="text-3xl font-bold text-gray-900">Chat Moderation</h1>
          <p className="text-gray-600 mt-1">Monitor and moderate platform messages</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900">{getMessages().length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Flagged Messages</p>
            <p className="text-2xl font-bold text-red-600">{flaggedCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Active Conversations</p>
            <p className="text-2xl font-bold text-green-600">{getConnections().filter(c => c.status === 'accepted').length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'flagged'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🚩 Flagged ({flaggedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Messages
          </button>
        </div>

        {/* Messages List */}
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 50).map(msg => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-xl shadow-sm p-4 ${msg.flagged ? 'border-2 border-red-300' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {msg.sender?.name.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{msg.sender?.name || 'Unknown'}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="text-gray-600">{msg.otherUser?.name || 'Unknown'}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                      {msg.flagged && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🚩 Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{msg.text}</p>
                    {msg.flagged && msg.flagReason && (
                      <p className="mt-2 text-sm text-red-600">
                        <strong>Flag reason:</strong> {msg.flagReason}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    {msg.flagged ? (
                      <>
                        <button
                          onClick={() => handleUnflag(msg.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          Unflag
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        {flaggingMessageId === msg.id ? (
                          <div className="flex flex-col space-y-2">
                            <input
                              type="text"
                              value={flagReason}
                              onChange={(e) => setFlagReason(e.target.value)}
                              placeholder="Reason..."
                              className="px-2 py-1 text-sm border rounded w-32 text-gray-900"
                            />
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleFlag(msg.id)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Flag
                              </button>
                              <button
                                onClick={() => setFlaggingMessageId(null)}
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setFlaggingMessageId(msg.id)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                          >
                            🚩 Flag
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">
              {filter === 'flagged' ? 'No flagged messages. All clear! ✨' : 'No messages yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
