'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collegesList, topicsList, languagesList, statesList } from '@/lib/seed-data';
import { MentorProfile } from '@/lib/types';

export default function MentorSignupPage() {
  const router = useRouter();
  const { signupMentor, user } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    college: '',
    major: '',
    minor: '',
    year: '' as MentorProfile['year'] | '',
    city: '',
    state: '',
    languages: [] as string[],
    topics: [] as string[],
    bio: ''
  });

  // Redirect if already logged in
  if (user) {
    router.push('/mentor/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleArrayItem = (field: 'languages' | 'topics', item: string) => {
    const current = formData[field];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  const filteredColleges = collegesList.filter(c => 
    c.toLowerCase().includes(collegeSearch.toLowerCase())
  ).slice(0, 10);

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.age) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.college || !formData.major || !formData.year || !formData.city || !formData.state) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.languages.length === 0) {
      setError('Please select at least one language');
      return false;
    }
    if (formData.topics.length === 0) {
      setError('Please select at least one topic you can guide on');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.bio || formData.bio.length < 50) {
      setError('Please write a bio of at least 50 characters');
      setLoading(false);
      return;
    }

    const result = await signupMentor({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age,
      college: formData.college,
      major: formData.major,
      minor: formData.minor || undefined,
      year: formData.year as MentorProfile['year'],
      city: formData.city,
      state: formData.state,
      languages: formData.languages,
      topics: formData.topics,
      bio: formData.bio
    });

    if (result.success) {
      router.push('/mentor/dashboard');
    } else {
      setError(result.error || 'An error occurred during signup');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`w-12 h-1 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={`${step === 1 ? 'font-semibold text-indigo-600' : ''}`}>Account</span>
            <span className="mx-4"></span>
            <span className={`${step === 2 ? 'font-semibold text-indigo-600' : ''}`}>College</span>
            <span className="mx-4"></span>
            <span className={`${step === 3 ? 'font-semibold text-indigo-600' : ''}`}>Expertise</span>
            <span className="mx-4"></span>
            <span className={`${step === 4 ? 'font-semibold text-indigo-600' : ''}`}>Bio</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 && 'Create your mentor account'}
              {step === 2 && 'Your college details'}
              {step === 3 && 'Your expertise'}
              {step === 4 && 'Tell us about yourself'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 1 && 'Join our community of mentors'}
              {step === 2 && 'Help students find you'}
              {step === 3 && 'What can you guide students on?'}
              {step === 4 && 'Write a compelling bio to attract mentees'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email (College email preferred)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@college.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="17"
                    max="30"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Step 2: College Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">College/University</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={collegeSearch || formData.college}
                      onChange={(e) => {
                        setCollegeSearch(e.target.value);
                        setFormData({ ...formData, college: e.target.value });
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Start typing to search..."
                    />
                    {collegeSearch && filteredColleges.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredColleges.map((college) => (
                          <button
                            key={college}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, college });
                              setCollegeSearch('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {college}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Major</label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minor (Optional)</label>
                    <input
                      type="text"
                      name="minor"
                      value={formData.minor}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Economics"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select your year</option>
                    <option value="first">1st Year</option>
                    <option value="second">2nd Year</option>
                    <option value="third">3rd Year</option>
                    <option value="fourth">4th Year</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select state</option>
                      {statesList.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Expertise */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages You Speak</label>
                  <div className="flex flex-wrap gap-2">
                    {languagesList.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('languages', lang)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          formData.languages.includes(lang)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topics You Can Guide On</label>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {topicsList.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleArrayItem('topics', topic)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          formData.topics.includes(topic)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bio */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Bio
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Tell students about yourself, your journey, achievements, and what you can help with. This will appear on your profile.
                  </p>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="E.g., AIR 156 in JEE Advanced 2022. Currently pursuing B.Tech in CS at IIT Bombay. Passionate about helping students crack JEE and navigate the IIT journey..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.bio.length}/400 characters (minimum 50)
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Verification Required</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your profile will be reviewed by our team before it becomes visible to students. 
                        This typically takes 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="confirm"
                    required
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirm" className="ml-2 text-sm text-gray-600">
                    I confirm that I am currently enrolled in or have graduated from the college mentioned above, 
                    and all information provided is accurate.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Login
                </Link>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Mentor Account'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
