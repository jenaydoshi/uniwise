'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MentorCard from '@/components/MentorCard';
import { MentorUser, MentorFilters } from '@/lib/types';
import { 
  getVerifiedMentors, 
  getConnectionsForUser, 
  createConnection,
  getConnectionByUsers
} from '@/lib/utils';
import { collegesList, examsList, topicsList, languagesList } from '@/lib/seed-data';

export default function MentorsPage() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorUser[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, 'none' | 'pending' | 'accepted'>>({});
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<MentorFilters>({
    search: '',
    college: '',
    exam: '',
    topic: '',
    language: '',
    state: '',
    city: '',
    availability: ''
  });

  useEffect(() => {
    loadMentors();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filters, mentors]);

  const loadMentors = () => {
    const allMentors = getVerifiedMentors();
    setMentors(allMentors);
    setFilteredMentors(allMentors);

    // Derive India-specific filters from mentor data
    const uniqueStates = Array.from(new Set(allMentors.map(m => m.profile.state).filter(Boolean)));
    const uniqueCities = Array.from(new Set(allMentors.map(m => m.profile.city).filter(Boolean)));
    setStatesList(uniqueStates);
    setCitiesList(uniqueCities);
    
    // Load connection statuses for current user
    if (user && user.role === 'mentee') {
      const connections = getConnectionsForUser(user.id, 'mentee');
      const statuses: Record<string, 'none' | 'pending' | 'accepted'> = {};
      connections.forEach(conn => {
        statuses[conn.mentorId] = conn.status === 'accepted' ? 'accepted' : conn.status === 'pending' ? 'pending' : 'none';
      });
      setConnectionStatuses(statuses);
    }
    
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...mentors];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(search) ||
        m.profile.college.toLowerCase().includes(search) ||
        m.profile.bio.toLowerCase().includes(search) ||
        m.profile.topics.some(t => t.toLowerCase().includes(search))
      );
    }

    // College filter
    if (filters.college) {
      result = result.filter(m => m.profile.college === filters.college);
    }

    // Exam/Topic filter
    if (filters.exam) {
      result = result.filter(m => m.profile.topics.includes(filters.exam));
    }

    // Topic filter
    if (filters.topic) {
      result = result.filter(m => m.profile.topics.includes(filters.topic));
    }

    // Language filter
    if (filters.language) {
      result = result.filter(m => m.profile.languages.includes(filters.language));
    }

    // State filter (India-specific)
    if (filters.state) {
      result = result.filter(m => m.profile.state === filters.state);
    }

    // City filter (India-specific)
    if (filters.city) {
      result = result.filter(m => m.profile.city === filters.city);
    }

    // Availability filter (India-specific preferred slots)
    if (filters.availability) {
      result = result.filter(m => (m.profile.availability || '').toLowerCase().includes(filters.availability.toLowerCase()));
    }

    setFilteredMentors(result);
  };

  const handleConnect = (mentorId: string) => {
    if (!user || user.role !== 'mentee') {
      // Redirect to login or show message
      window.location.href = '/login';
      return;
    }

    // Check if connection already exists
    const existing = getConnectionByUsers(user.id, mentorId);
    if (existing) return;

    // Create new connection
    createConnection({
      menteeId: user.id,
      mentorId: mentorId,
      status: 'pending',
      message: `Hi! I'm ${user.name} and I'd love to connect with you for mentorship.`
    });

    // Update local state
    setConnectionStatuses(prev => ({ ...prev, [mentorId]: 'pending' }));

    // Auto-accept after delay (MVP demo behavior)
    setTimeout(() => {
      const conn = getConnectionByUsers(user.id, mentorId);
      if (conn) {
        // In real app, this would be done by mentor
        // For MVP, we auto-accept
        setConnectionStatuses(prev => ({ ...prev, [mentorId]: 'accepted' }));
      }
    }, 2000);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      college: '',
      exam: '',
      topic: '',
      language: '',
      state: '',
      city: '',
      availability: ''
    });
  };

  const activeFilterCount = [filters.college, filters.exam, filters.topic, filters.language, filters.state, filters.city, filters.availability].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {user && user.role === 'mentee' && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
              <p className="text-indigo-800">
                👋 Welcome, <span className="font-semibold">{user.name}</span>! Find your perfect mentor below.
              </p>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900">Find a Mentor</h1>
          <p className="mt-2 text-gray-600">
            Connect with verified students from India&apos;s top colleges
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, college, or topics..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 border rounded-lg font-medium flex items-center justify-center space-x-2 transition ${
                showFilters || activeFilterCount > 0
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <select
                    value={filters.college}
                    onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Colleges</option>
                    {collegesList.slice(0, 30).map((college) => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                  <select
                    value={filters.exam}
                    onChange={(e) => setFilters({ ...filters, exam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Exams</option>
                    {examsList.map((exam) => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All States</option>
                    {statesList.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Cities</option>
                    {citiesList.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Language</option>
                    {languagesList.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <select
                    value={filters.topic}
                    onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Topic</option>
                    {topicsList.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Slot</option>
                    <option value="weekend">Weekend slots</option>
                    <option value="weekday">Weekday slots</option>
                    <option value="evening">Evenings (IST)</option>
                    <option value="morning">Early mornings (IST)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No mentors found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                connectionStatus={connectionStatuses[mentor.id] || 'none'}
                onConnect={() => handleConnect(mentor.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
