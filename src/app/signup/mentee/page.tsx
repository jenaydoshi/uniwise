'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collegesList, examsList, topicsList } from '@/lib/seed-data';
import { MenteeProfile } from '@/lib/types';

export default function MenteeSignupPage() {
  const router = useRouter();
  const { signupMentee, user } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    class: '' as MenteeProfile['class'] | '',
    targetColleges: [] as string[],
    exams: [] as string[],
    interests: [] as string[],
    goalsText: ''
  });

  // Redirect if already logged in
  if (user) {
    router.push('/mentors');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleArrayItem = (field: 'targetColleges' | 'exams' | 'interests', item: string) => {
    const current = formData[field];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

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
    if (!formData.class) {
      setError('Please select your class');
      return false;
    }
    if (formData.exams.length === 0) {
      setError('Please select at least one exam');
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

    if (!formData.goalsText) {
      setError('Please tell us about your goals');
      setLoading(false);
      return;
    }

    const result = await signupMentee({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age,
      class: formData.class as MenteeProfile['class'],
      targetColleges: formData.targetColleges,
      exams: formData.exams,
      interests: formData.interests,
      goalsText: formData.goalsText
    });

    if (result.success) {
      router.push('/mentors');
    } else {
      setError(result.error || 'An error occurred during signup');
    }
    
    setLoading(false);
  };

  const interestOptions = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical',
    'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Medicine',
    'Law', 'Constitutional Law', 'Corporate Law', 'Criminal Law',
    'Business', 'Finance', 'Consulting', 'Startups', 'Research'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-16 h-1 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={step === 1 ? 'font-semibold text-indigo-600' : ''}>Account</span>
            <span className="mx-8"></span>
            <span className={step === 2 ? 'font-semibold text-indigo-600' : ''}>Education</span>
            <span className="mx-8"></span>
            <span className={step === 3 ? 'font-semibold text-indigo-600' : ''}>Goals</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 && 'Create your account'}
              {step === 2 && 'Your education details'}
              {step === 3 && 'Your goals & interests'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 1 && 'Start your mentorship journey'}
              {step === 2 && 'Help us find the right mentors for you'}
              {step === 3 && 'Tell us what you want to achieve'}
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
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="14"
                    max="25"
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

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select your class</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="gap_year">Gap Year / Dropper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exams Preparing For</label>
                  <div className="flex flex-wrap gap-2">
                    {examsList.slice(0, 10).map((exam) => (
                      <button
                        key={exam}
                        type="button"
                        onClick={() => toggleArrayItem('exams', exam)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          formData.exams.includes(exam)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Colleges (Optional)</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {collegesList.slice(0, 20).map((college) => (
                      <button
                        key={college}
                        type="button"
                        onClick={() => toggleArrayItem('targetColleges', college)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          formData.targetColleges.includes(college)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {college}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleArrayItem('interests', interest)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          formData.interests.includes(interest)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tell us about your goals
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    What challenges are you facing? What do you want to achieve?
                  </p>
                  <textarea
                    name="goalsText"
                    value={formData.goalsText}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="E.g., I want to crack JEE Advanced and get into IIT Bombay CS. Currently struggling with Physics Mechanics..."
                  />
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
              
              {step < 3 ? (
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
