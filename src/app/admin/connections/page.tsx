'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { Connection, User } from '@/lib/types';
import { getConnections, getUserById, updateConnection, formatDate } from '@/lib/utils';

interface ConnectionWithUsers extends Connection {
  mentee: User | null;
  mentor: User | null;
}

export default function AdminConnectionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [connections, setConnections] = useState<ConnectionWithUsers[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'blocked'>('all');
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
    loadConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadConnections = () => {
    const allConnections = getConnections();
    const connectionsWithUsers: ConnectionWithUsers[] = allConnections.map(conn => ({
      ...conn,
      mentee: getUserById(conn.menteeId),
      mentor: getUserById(conn.mentorId)
    }));

    // Sort by date, most recent first
    connectionsWithUsers.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    setConnections(connectionsWithUsers);
    setLoading(false);
  };

  const handleBlock = (connectionId: string) => {
    if (confirm('Block this connection? The users will no longer be able to message each other.')) {
      updateConnection(connectionId, { status: 'blocked' });
      loadConnections();
    }
  };

  const handleUnblock = (connectionId: string) => {
    updateConnection(connectionId, { status: 'accepted' });
    loadConnections();
  };

  const filteredConnections = connections.filter(conn => {
    if (filter === 'all') return true;
    return conn.status === filter;
  });

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

  const statusCounts = {
    all: connections.length,
    pending: connections.filter(c => c.status === 'pending').length,
    accepted: connections.filter(c => c.status === 'accepted').length,
    rejected: connections.filter(c => c.status === 'rejected').length,
    blocked: connections.filter(c => c.status === 'blocked').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="text-gray-600 mt-1">
            Manage mentee-mentor connections. <strong>Connections</strong> are relationships between mentees and mentors - 
            when a mentee requests to connect with a mentor, a connection is created.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {(['all', 'pending', 'accepted', 'rejected', 'blocked'] as const).map(status => (
            <div 
              key={status}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition ${filter === status ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setFilter(status)}
            >
              <p className="text-sm text-gray-500 capitalize">{status}</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts[status]}</p>
            </div>
          ))}
        </div>

        {/* Connections List */}
        {filteredConnections.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConnections.map(conn => (
                  <tr key={conn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{conn.mentee?.name.charAt(0) || '?'}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{conn.mentee?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{conn.mentee?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{conn.mentor?.name.charAt(0) || '?'}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{conn.mentor?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{conn.mentor?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(conn.status)}`}>
                        {conn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(conn.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {conn.status === 'blocked' ? (
                        <button
                          onClick={() => handleUnblock(conn.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          Unblock
                        </button>
                      ) : conn.status === 'accepted' ? (
                        <button
                          onClick={() => handleBlock(conn.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          Block
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No connections found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
