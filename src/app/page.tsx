'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Real Students. Real Guidance.
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Connect with college students and get authentic insights on college life, admissions, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                user.role === 'mentee' ? (
                  <Link
                    href="/mentors"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Find a Mentor
                  </Link>
                ) : user.role === 'mentor' ? (
                  <Link
                    href="/mentor/dashboard"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/admin"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Admin Dashboard
                  </Link>
                )
              ) : (
                <>
                  <Link
                    href="/mentors"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Find a Mentor
                  </Link>
                  <Link
                    href="/signup/mentor"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition"
                  >
                    Become a Mentor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>



      {/* How It Works */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How UniWise Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized guidance in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Find Your Mentor</h3>
              <p className="text-gray-600">
                Search verified mentors by college, exam, or interests. Filter by language and topics you need help with.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Connect & Chat</h3>
              <p className="text-gray-600">
                Send a connection request. Once accepted, start chatting about exams, admissions, campus life & more.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Succeed Together</h3>
              <p className="text-gray-600">
                Get authentic guidance from someone who has been there. Join our community for Q&A and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colleges Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mentors from India&apos;s Top Colleges
            </h2>
            <p className="text-xl text-gray-600">
              Verified students from premier institutions across the country
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['IIT Bombay', 'AIIMS Delhi', 'NLU Delhi', 'BITS Pilani', 'IIT Delhi', 'NIT Trichy', 'IIM Bangalore', 'NLSIU Bangalore'].map((college) => (
              <div key={college} className="px-6 py-3 bg-gray-100 rounded-full text-gray-700 font-medium">
                {college}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exams Covered */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Expert Guidance for All Major Exams
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'JEE Main', icon: '🎯' },
              { name: 'JEE Advanced', icon: '🚀' },
              { name: 'NEET', icon: '⚕️' },
              { name: 'CLAT', icon: '⚖️' },
              { name: 'BITSAT', icon: '💻' },
              { name: 'IPMAT', icon: '📊' },
            ].map((exam) => (
              <div key={exam.name} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center hover:bg-white/20 transition">
                <div className="text-3xl mb-2">{exam.icon}</div>
                <div className="text-white font-medium">{exam.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from students who found their path with UniWise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">R</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Rahul S.</div>
                  <div className="text-sm text-gray-500">JEE 2024 - AIR 1,234</div>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;My mentor from IIT Bombay helped me understand where I was going wrong in Physics. 
                His tips on time management during mocks were game-changing!&quot;
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">P</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Priya M.</div>
                  <div className="text-sm text-gray-500">NEET 2024 - AIIMS Delhi</div>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;Being from a small town with no coaching, I felt lost. My UniWise mentor 
                showed me I could crack NEET with just NCERT and the right strategy.&quot;
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">A</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Ankit K.</div>
                  <div className="text-sm text-gray-500">CLAT 2024 - NLU Delhi</div>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;I had no idea how law school admissions worked. My mentor walked me through 
                everything - from CLAT prep to what to expect in college.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students getting personalized guidance from verified college mentors.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup/mentee"
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                Join as Mentee - It&apos;s Free
              </Link>
              <Link
                href="/signup/mentor"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                Become a Mentor
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-400 mb-4">UniWise</h3>
              <p className="text-gray-400">
                Democratizing mentorship for Indian students preparing for competitive exams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/mentors" className="hover:text-white transition">Find a Mentor</Link></li>
                <li><Link href="/community" className="hover:text-white transition">Community Q&A</Link></li>
                <li><Link href="/signup/mentee" className="hover:text-white transition">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Mentors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup/mentor" className="hover:text-white transition">Become a Mentor</Link></li>
                <li><Link href="/community" className="hover:text-white transition">Answer Questions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Exams</h4>
              <ul className="space-y-2 text-gray-400">
                <li>JEE Main & Advanced</li>
                <li>NEET</li>
                <li>CLAT</li>
                <li>BITSAT</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 UniWise. Made with ❤️ for Indian students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
