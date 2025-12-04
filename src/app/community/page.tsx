'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, isMenteeUser, isMentorUser } from '@/context/AuthContext';
import { CommunityThread, CommunityAnswer, User } from '@/lib/types';
import { 
  getThreads, 
  getAnswers, 
  createThread,
  createAnswer,
  upvoteThread,
  upvoteAnswer,
  getUserById,
  generateId,
  getTimestamp
} from '@/lib/utils';

const categories = ['Admissions', 'Exams', 'Campus Life', 'Scholarships', 'Careers'] as const;

interface ThreadWithAuthor extends CommunityThread {
  author: User | null;
  answers: (CommunityAnswer & { author: User | null })[];
}

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadWithAuthor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '', category: 'Admissions' as typeof categories[number] });
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadThreads = () => {
    const allThreads = getThreads();
    const allAnswers = getAnswers();

    const threadsWithDetails: ThreadWithAuthor[] = allThreads.map(thread => {
      const author = getUserById(thread.authorId);
      const threadAnswers = allAnswers
        .filter(a => a.threadId === thread.id)
        .map(answer => ({
          ...answer,
          author: getUserById(answer.authorId)
        }));

      return {
        ...thread,
        author,
        answers: threadAnswers
      };
    });

    // Sort by most recent
    threadsWithDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setThreads(threadsWithDetails);
    setLoading(false);
  };

  const handleCreateThread = () => {
    if (!user || !newThread.title.trim() || !newThread.content.trim()) return;

    createThread({
      authorId: user.id,
      title: newThread.title.trim(),
      content: newThread.content.trim(),
      category: newThread.category
    });

    setNewThread({ title: '', content: '', category: 'Admissions' });
    setShowNewThread(false);
    loadThreads();
  };

  const handleUpvoteThread = (threadId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const thread = threads.find(t => t.id === threadId);
    if (thread?.upvotedBy.includes(user.id)) return;

    upvoteThread(threadId, user.id);
    loadThreads();
  };

  const handleCreateAnswer = (threadId: string) => {
    if (!user || !newAnswer.trim()) return;

    createAnswer({
      threadId,
      authorId: user.id,
      content: newAnswer.trim(),
      isMentorAnswer: isMentorUser(user)
    });

    setNewAnswer('');
    loadThreads();
  };

  const handleUpvoteAnswer = (answerId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    upvoteAnswer(answerId, user.id);
    loadThreads();
  };

  const filteredThreads = selectedCategory === 'All' 
    ? threads 
    : threads.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Q&A</h1>
            <p className="text-gray-600 mt-1">Ask questions and learn from others</p>
          </div>
          {user && (
            <button
              onClick={() => setShowNewThread(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Ask Question
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* New Thread Modal */}
        {showNewThread && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={() => setShowNewThread(false)}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newThread.category}
                        onChange={(e) => setNewThread({ ...newThread, category: e.target.value as typeof categories[number] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                      <input
                        type="text"
                        value={newThread.title}
                        onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., How to balance JEE prep with boards?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <textarea
                        value={newThread.content}
                        onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Provide more context about your question..."
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleCreateThread}
                    disabled={!newThread.title.trim() || !newThread.content.trim()}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Post Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewThread(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threads List */}
        {filteredThreads.length > 0 ? (
          <div className="space-y-4">
            {filteredThreads.map(thread => (
              <div key={thread.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Upvote */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleUpvoteThread(thread.id)}
                        disabled={thread.upvotedBy.includes(user?.id || '')}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          thread.upvotedBy.includes(user?.id || '') ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-700">{thread.upvotes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {thread.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 
                        className="mt-2 text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                        onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
                      >
                        {thread.title}
                      </h3>
                      <p className="mt-1 text-gray-600 text-sm line-clamp-2">{thread.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{thread.author?.name.charAt(0) || '?'}</span>
                          </div>
                          <span className="text-sm text-gray-600">{thread.author?.name || 'Unknown'}</span>
                        </div>
                        <button
                          onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          {thread.answers.length} {thread.answers.length === 1 ? 'answer' : 'answers'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded - Answers */}
                {expandedThread === thread.id && (
                  <div className="border-t border-gray-100">
                    <div className="p-6 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-4">Answers</h4>
                      
                      {thread.answers.length > 0 ? (
                        <div className="space-y-4 mb-4">
                          {thread.answers
                            .sort((a, b) => b.upvotes - a.upvotes)
                            .map(answer => (
                            <div key={answer.id} className="bg-white rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex flex-col items-center">
                                  <button
                                    onClick={() => handleUpvoteAnswer(answer.id)}
                                    disabled={answer.upvotedBy.includes(user?.id || '')}
                                    className={`p-1 rounded hover:bg-gray-100 ${
                                      answer.upvotedBy.includes(user?.id || '') ? 'text-indigo-600' : 'text-gray-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <span className="text-xs font-medium text-gray-600">{answer.upvotes}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">{answer.author?.name.charAt(0) || '?'}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{answer.author?.name || 'Unknown'}</span>
                                    {answer.isMentorAnswer && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Mentor
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-700 text-sm">{answer.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mb-4">No answers yet. Be the first to answer!</p>
                      )}

                      {/* Add Answer */}
                      {user ? (
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={newAnswer}
                              onChange={(e) => setNewAnswer(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Write your answer..."
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => handleCreateAnswer(thread.id)}
                                disabled={!newAnswer.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                              >
                                Post Answer
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Log in to answer
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No questions yet</h3>
            <p className="mt-2 text-gray-500">Be the first to ask a question!</p>
            {user && (
              <button
                onClick={() => setShowNewThread(true)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Ask Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
