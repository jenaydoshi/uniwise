// User roles
export type UserRole = 'mentee' | 'mentor' | 'admin';

// Verification status for mentors
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

// Connection status between mentee and mentor
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

// Report status
export type ReportStatus = 'new' | 'in_review' | 'resolved' | 'dismissed';

// Base User interface
export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profilePhotoUrl?: string;
}

// Mentee Profile
export interface MenteeProfile {
  userId: string;
  class: '10' | '11' | '12' | 'gap_year';
  targetColleges: string[];
  exams: string[];
  interests: string[];
  goalsText: string;
  city?: string;
  state?: string;
}

// Mentor Profile
export interface MentorProfile {
  userId: string;
  college: string;
  major: string;
  minor?: string;
  year: 'first' | 'second' | 'third' | 'fourth' | 'graduated';
  city: string;
  state: string;
  languages: string[];
  topics: string[];
  bio: string;
  verificationStatus: VerificationStatus;
  verificationBadge: boolean;
  faqs: { question: string; answer: string }[];
  availability?: string;
}

// Connection between Mentee and Mentor
export interface Connection {
  id: string;
  menteeId: string;
  mentorId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  message?: string; // Optional message from mentee when requesting
}

// Chat Message
export interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

// Community Thread
export interface CommunityThread {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: 'Admissions' | 'Exams' | 'Campus Life' | 'Scholarships' | 'Careers';
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
}

// Community Answer
export interface CommunityAnswer {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  isMentorAnswer: boolean;
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
}

// Admin Verification Request
export interface VerificationRequest {
  id: string;
  mentorId: string;
  status: VerificationStatus;
  documents: string[];
  notes: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Admin Report
export interface AdminReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: 'Harassment' | 'Spam' | 'Fraud' | 'Inappropriate' | 'Other';
  description: string;
  evidenceUrls: string[];
  status: ReportStatus;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Admin Log
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetUserId?: string;
  details: string;
  createdAt: string;
}

// Combined user with profile for easier usage
export interface MenteeUser extends User {
  role: 'mentee';
  profile: MenteeProfile;
}

export interface MentorUser extends User {
  role: 'mentor';
  profile: MentorProfile;
}

export interface AdminUser extends User {
  role: 'admin';
}

export type AuthenticatedUser = MenteeUser | MentorUser | AdminUser;

// Form types for signup
export interface MenteeSignupData {
  name: string;
  email: string;
  password: string;
  age: string;
  class: MenteeProfile['class'];
  targetColleges: string[];
  exams: string[];
  interests: string[];
  goalsText: string;
}

export interface MentorSignupData {
  name: string;
  email: string;
  password: string;
  age: string;
  college: string;
  major: string;
  minor?: string;
  year: MentorProfile['year'];
  city: string;
  state: string;
  languages: string[];
  topics: string[];
  bio: string;
}

// Filter options for mentor search
export interface MentorFilters {
  search: string;
  college: string;
  exam: string;
  topic: string;
  language: string;
}

// Dashboard stats
export interface MentorDashboardStats {
  activeMentees: number;
  totalMessages: number;
  communityContributions: number;
  averageRating: number;
  pendingRequests: number;
}

export interface AdminDashboardStats {
  totalMentees: number;
  totalMentors: number;
  pendingVerifications: number;
  activeChatsToday: number;
  flaggedConversations: number;
  openReports: number;
}
