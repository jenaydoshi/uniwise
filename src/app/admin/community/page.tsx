'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isAdminUser } from '@/context/AuthContext';
import { CommunityThread, CommunityAnswer, User, ModerationFlag } from '@/lib/types';
import { getThreads, getAnswers, getUserById, formatDate, getFlags, updateFlagStatus } from '@/lib/utils';

interface ThreadWithAuthor extends CommunityThread {
  author: User | null;
  answerCount: number;
}

interface AnswerWithAuthor extends CommunityAnswer {
  author: User | null;
  thread: CommunityThread | null;
}

export default function AdminCommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadWithAuthor[]>([]);
  const [answers, setAnswers] = useState<AnswerWithAuthor[]>([]);
  const [flags, setFlags] = useState<ModerationFlag[]>([]);
  const [view, setView] = useState<'threads' | 'answers' | 'flags'>('threads');
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
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = () => {
    const allThreads = getThreads();
    const allAnswers = getAnswers();
    const allFlags = getFlags().filter(f => f.targetType === 'thread' || f.targetType === 'answer');

    const threadsWithAuthors: ThreadWithAuthor[] = allThreads.map(thread => ({
      ...thread,
      author: getUserById(thread.authorId),
      answerCount: allAnswers.filter(a => a.threadId === thread.id).length
    }));

    const answersWithAuthors: AnswerWithAuthor[] = allAnswers.map(answer => ({
      ...answer,
      author: getUserById(answer.authorId),
      thread: allThreads.find(t => t.id === answer.threadId) || null
    }));

    // Sort by date, most recent first
    threadsWithAuthors.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    answersWithAuthors.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    allFlags.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setThreads(threadsWithAuthors);
    setAnswers(answersWithAuthors);
    setFlags(allFlags);
    setLoading(false);
  };

  const handleFlagStatus = (flagId: string, status: ModerationFlag['status']) => {
    updateFlagStatus(flagId, status, user?.id);
    loadData();
  };

  const handleDeleteThread = (threadId: string) => {
    if (confirm('Delete this thread and all its answers? This cannot be undone.')) {
      // Delete from localStorage
      const storedThreads = localStorage.getItem('uniwise_threads');
      const storedAnswers = localStorage.getItem('uniwise_answers');
      
      if (storedThreads) {
        const allThreads = JSON.parse(storedThreads);
        const updated = allThreads.filter((t: CommunityThread) => t.id !== threadId);
        localStorage.setItem('uniwise_threads', JSON.stringify(updated));
      }
      
      if (storedAnswers) {
        const allAnswers = JSON.parse(storedAnswers);
        const updated = allAnswers.filter((a: CommunityAnswer) => a.threadId !== threadId);
        localStorage.setItem('uniwise_answers', JSON.stringify(updated));
      }
      
      loadData();
    }
  };

  const handleDeleteAnswer = (answerId: string) => {
    if (confirm('Delete this answer? This cannot be undone.')) {
      const storedAnswers = localStorage.getItem('uniwise_answers');
      if (storedAnswers) {
        const allAnswers = JSON.parse(storedAnswers);
        const updated = allAnswers.filter((a: CommunityAnswer) => a.id !== answerId);
        localStorage.setItem('uniwise_answers', JSON.stringify(updated));
      }
      loadData();
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

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Admissions': 'bg-blue-100 text-blue-800',
      'Exams': 'bg-purple-100 text-purple-800',
      'Campus Life': 'bg-green-100 text-green-800',
      'Scholarships': 'bg-yellow-100 text-yellow-800',
      'Careers': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Community Moderation</h1>
          <p className="text-gray-600 mt-1">Manage Q&A threads and answers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Threads</p>
            <p className="text-2xl font-bold text-gray-900">{threads.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Answers</p>
            <p className="text-2xl font-bold text-gray-900">{answers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Mentor Answers</p>
            <p className="text-2xl font-bold text-green-600">{answers.filter(a => a.isMentorAnswer).length}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setView('threads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'threads'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Threads ({threads.length})
          </button>
          <button
            onClick={() => setView('answers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'answers'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Answers ({answers.length})
          </button>
          <button
            onClick={() => setView('flags')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'flags'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🚩 Flags ({flags.length})
          </button>
        </div>

        {/* Content */}
        {view === 'threads' ? (
          threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map(thread => (
                <div key={thread.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(thread.category)}`}>
                          {thread.category}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(thread.createdAt)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{thread.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{thread.content}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {thread.author?.name || 'Unknown'}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {thread.answerCount} answers
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          {thread.upvotes} upvotes
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteThread(thread.id)}
                      className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No threads yet.</p>
            </div>
          )
        ) : (
          answers.length > 0 ? (
            <div className="space-y-4">
              {answers.map(answer => (
                <div key={answer.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{answer.author?.name.charAt(0) || '?'}</span>
                        </div>
                        <span className="font-medium text-gray-900">{answer.author?.name || 'Unknown'}</span>
                        {answer.isMentorAnswer && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Mentor
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(answer.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{answer.content}</p>
                      <p className="text-xs text-gray-400">
                        On thread: <span className="text-gray-600">{answer.thread?.title || 'Unknown thread'}</span>
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {answer.upvotes} upvotes
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No answers yet.</p>
            </div>
          )
        )}

        {/* Flags View */}
        {view === 'flags' && (
          flags.length > 0 ? (
            <div className="space-y-4">
              {flags.map(flag => {
                const targetContent = flag.targetType === 'thread'
                  ? threads.find(t => t.id === flag.targetId)
                  : answers.find(a => a.id === flag.targetId);
                const reporter = getUserById(flag.reporterId);

                return (
                  <div key={flag.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            flag.status === 'new' ? 'bg-red-100 text-red-800' :
                            flag.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                            flag.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {flag.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(flag.createdAt)}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{flag.targetType.toUpperCase()}</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">Reason: {flag.reason}</p>
                        {flag.notes && <p className="text-sm text-gray-600 mb-2">Notes: {flag.notes}</p>}
                        <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded">
                          {flag.targetType === 'thread'
                            ? `"${(targetContent as ThreadWithAuthor)?.title || 'Thread not found'}"`
                            : `"${(targetContent as AnswerWithAuthor)?.content?.slice(0, 100) || 'Answer not found'}..."`
                          }
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Reported by: {reporter?.name || 'Unknown'}</p>
                          {flag.resolvedBy && (
                            <p>Resolved by: {getUserById(flag.resolvedBy)?.name || 'Unknown'}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        {flag.status === 'new' && (
                          <>
                            <button
                              onClick={() => handleFlagStatus(flag.id, 'in_review')}
                              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                            >
                              In Review
                            </button>
                            <button
                              onClick={() => handleFlagStatus(flag.id, 'resolved')}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                        {flag.status === 'in_review' && (
                          <>
                            <button
                              onClick={() => handleFlagStatus(flag.id, 'resolved')}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleFlagStatus(flag.id, 'dismissed')}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No flagged content.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
