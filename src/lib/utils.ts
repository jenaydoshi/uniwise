import { 
  User, 
  MentorProfile, 
  MenteeProfile, 
  Connection, 
  ChatMessage, 
  CommunityThread, 
  CommunityAnswer,
  AuthenticatedUser,
  MenteeUser,
  MentorUser
} from './types';
import {
  sampleMentorUsers,
  sampleMentorProfiles,
  sampleMenteeUsers,
  sampleMenteeProfiles,
  adminUser,
  sampleConnections,
  sampleChatMessages,
  sampleCommunityThreads,
  sampleCommunityAnswers,
  sampleVerificationRequests,
  sampleReports
} from './seed-data';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'uniwise_current_user',
  USERS: 'uniwise_users',
  MENTOR_PROFILES: 'uniwise_mentor_profiles',
  MENTEE_PROFILES: 'uniwise_mentee_profiles',
  CONNECTIONS: 'uniwise_connections',
  MESSAGES: 'uniwise_messages',
  THREADS: 'uniwise_threads',
  ANSWERS: 'uniwise_answers',
  VERIFICATIONS: 'uniwise_verifications',
  REPORTS: 'uniwise_reports',
  INITIALIZED: 'uniwise_initialized'
};

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Get current timestamp
export const getTimestamp = () => new Date().toISOString();

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// Format date for messages
export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

// Initialize data in localStorage
export const initializeData = () => {
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  // Combine all users
  const allUsers = [...sampleMentorUsers, ...sampleMenteeUsers, adminUser];
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  localStorage.setItem(STORAGE_KEYS.MENTOR_PROFILES, JSON.stringify(sampleMentorProfiles));
  localStorage.setItem(STORAGE_KEYS.MENTEE_PROFILES, JSON.stringify(sampleMenteeProfiles));
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(sampleConnections));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(sampleChatMessages));
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(sampleCommunityThreads));
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(sampleCommunityAnswers));
  localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(sampleVerificationRequests));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(sampleReports));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
};

// Reset all data
export const resetData = () => {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  initializeData();
};

// ============ USER OPERATIONS ============

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const createUser = (user: User): User => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return user;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates, updatedAt: getTimestamp() };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[index];
};

// ============ MENTOR PROFILE OPERATIONS ============

export const getMentorProfiles = (): MentorProfile[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.MENTOR_PROFILES);
  return data ? JSON.parse(data) : [];
};

export const getMentorProfileByUserId = (userId: string): MentorProfile | null => {
  const profiles = getMentorProfiles();
  return profiles.find(p => p.userId === userId) || null;
};

export const createMentorProfile = (profile: MentorProfile): MentorProfile => {
  const profiles = getMentorProfiles();
  profiles.push(profile);
  localStorage.setItem(STORAGE_KEYS.MENTOR_PROFILES, JSON.stringify(profiles));
  return profile;
};

export const updateMentorProfile = (userId: string, updates: Partial<MentorProfile>): MentorProfile | null => {
  const profiles = getMentorProfiles();
  const index = profiles.findIndex(p => p.userId === userId);
  if (index === -1) return null;
  profiles[index] = { ...profiles[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.MENTOR_PROFILES, JSON.stringify(profiles));
  return profiles[index];
};

// Get full mentor data (user + profile)
export const getMentorWithProfile = (userId: string): MentorUser | null => {
  const user = getUserById(userId);
  const profile = getMentorProfileByUserId(userId);
  if (!user || !profile || user.role !== 'mentor') return null;
  return { ...user, role: 'mentor', profile } as MentorUser;
};

// Get all verified mentors with profiles
export const getVerifiedMentors = (): MentorUser[] => {
  const users = getUsers().filter(u => u.role === 'mentor');
  const profiles = getMentorProfiles().filter(p => p.verificationStatus === 'verified');
  
  return users
    .filter(u => profiles.some(p => p.userId === u.id))
    .map(u => ({
      ...u,
      role: 'mentor' as const,
      profile: profiles.find(p => p.userId === u.id)!
    }));
};

// ============ MENTEE PROFILE OPERATIONS ============

export const getMenteeProfiles = (): MenteeProfile[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.MENTEE_PROFILES);
  return data ? JSON.parse(data) : [];
};

export const getMenteeProfileByUserId = (userId: string): MenteeProfile | null => {
  const profiles = getMenteeProfiles();
  return profiles.find(p => p.userId === userId) || null;
};

export const createMenteeProfile = (profile: MenteeProfile): MenteeProfile => {
  const profiles = getMenteeProfiles();
  profiles.push(profile);
  localStorage.setItem(STORAGE_KEYS.MENTEE_PROFILES, JSON.stringify(profiles));
  return profile;
};

export const updateMenteeProfile = (userId: string, updates: Partial<MenteeProfile>): MenteeProfile | null => {
  const profiles = getMenteeProfiles();
  const index = profiles.findIndex(p => p.userId === userId);
  if (index === -1) return null;
  profiles[index] = { ...profiles[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.MENTEE_PROFILES, JSON.stringify(profiles));
  return profiles[index];
};

// Get full mentee data
export const getMenteeWithProfile = (userId: string): MenteeUser | null => {
  const user = getUserById(userId);
  const profile = getMenteeProfileByUserId(userId);
  if (!user || !profile || user.role !== 'mentee') return null;
  return { ...user, role: 'mentee', profile } as MenteeUser;
};

// ============ CONNECTION OPERATIONS ============

export const getConnections = (): Connection[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  return data ? JSON.parse(data) : [];
};

export const getConnectionById = (id: string): Connection | null => {
  const connections = getConnections();
  return connections.find(c => c.id === id) || null;
};

export const getConnectionByUsers = (menteeId: string, mentorId: string): Connection | null => {
  const connections = getConnections();
  return connections.find(c => c.menteeId === menteeId && c.mentorId === mentorId) || null;
};

export const getConnectionsForUser = (userId: string, role: 'mentee' | 'mentor'): Connection[] => {
  const connections = getConnections();
  return role === 'mentee' 
    ? connections.filter(c => c.menteeId === userId)
    : connections.filter(c => c.mentorId === userId);
};

export const createConnection = (connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Connection => {
  const connections = getConnections();
  const newConnection: Connection = {
    ...connection,
    id: `conn-${generateId()}`,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  };
  connections.push(newConnection);
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  return newConnection;
};

export const updateConnection = (id: string, updates: Partial<Connection>): Connection | null => {
  const connections = getConnections();
  const index = connections.findIndex(c => c.id === id);
  if (index === -1) return null;
  connections[index] = { ...connections[index], ...updates, updatedAt: getTimestamp() };
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  return connections[index];
};

// ============ MESSAGE OPERATIONS ============

export const getMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : [];
};

export const getMessagesByConnection = (connectionId: string): ChatMessage[] => {
  const messages = getMessages();
  return messages.filter(m => m.connectionId === connectionId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export const createMessage = (message: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage => {
  const messages = getMessages();
  const newMessage: ChatMessage = {
    ...message,
    id: `msg-${generateId()}`,
    createdAt: getTimestamp()
  };
  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  return newMessage;
};

export const markMessagesAsRead = (connectionId: string, userId: string): void => {
  const messages = getMessages();
  const updated = messages.map(m => 
    m.connectionId === connectionId && m.senderId !== userId 
      ? { ...m, read: true } 
      : m
  );
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
};

export const getUnreadCount = (connectionId: string, userId: string): number => {
  const messages = getMessages();
  return messages.filter(m => m.connectionId === connectionId && m.senderId !== userId && !m.read).length;
};

// ============ COMMUNITY OPERATIONS ============

export const getThreads = (): CommunityThread[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.THREADS);
  return data ? JSON.parse(data) : [];
};

export const getThreadById = (id: string): CommunityThread | null => {
  const threads = getThreads();
  return threads.find(t => t.id === id) || null;
};

export const createThread = (thread: Omit<CommunityThread, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy'>): CommunityThread => {
  const threads = getThreads();
  const newThread: CommunityThread = {
    ...thread,
    id: `thread-${generateId()}`,
    upvotes: 0,
    upvotedBy: [],
    createdAt: getTimestamp()
  };
  threads.push(newThread);
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  return newThread;
};

export const upvoteThread = (threadId: string, userId: string): CommunityThread | null => {
  const threads = getThreads();
  const index = threads.findIndex(t => t.id === threadId);
  if (index === -1) return null;
  
  const thread = threads[index];
  if (thread.upvotedBy.includes(userId)) {
    // Remove upvote
    thread.upvotedBy = thread.upvotedBy.filter(id => id !== userId);
    thread.upvotes--;
  } else {
    // Add upvote
    thread.upvotedBy.push(userId);
    thread.upvotes++;
  }
  
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  return thread;
};

export const deleteThread = (threadId: string): boolean => {
  const threads = getThreads();
  const filtered = threads.filter(t => t.id !== threadId);
  if (filtered.length === threads.length) return false;
  localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(filtered));
  
  // Also delete associated answers
  const answers = getAnswers();
  const filteredAnswers = answers.filter(a => a.threadId !== threadId);
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(filteredAnswers));
  
  return true;
};

export const getAnswers = (): CommunityAnswer[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  return data ? JSON.parse(data) : [];
};

export const getAnswersByThread = (threadId: string): CommunityAnswer[] => {
  const answers = getAnswers();
  return answers.filter(a => a.threadId === threadId).sort(
    (a, b) => b.upvotes - a.upvotes // Sort by upvotes descending
  );
};

export const createAnswer = (answer: Omit<CommunityAnswer, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy'>): CommunityAnswer => {
  const answers = getAnswers();
  const newAnswer: CommunityAnswer = {
    ...answer,
    id: `ans-${generateId()}`,
    upvotes: 0,
    upvotedBy: [],
    createdAt: getTimestamp()
  };
  answers.push(newAnswer);
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
  return newAnswer;
};

export const upvoteAnswer = (answerId: string, userId: string): CommunityAnswer | null => {
  const answers = getAnswers();
  const index = answers.findIndex(a => a.id === answerId);
  if (index === -1) return null;
  
  const answer = answers[index];
  if (answer.upvotedBy.includes(userId)) {
    answer.upvotedBy = answer.upvotedBy.filter(id => id !== userId);
    answer.upvotes--;
  } else {
    answer.upvotedBy.push(userId);
    answer.upvotes++;
  }
  
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
  return answer;
};

export const deleteAnswer = (answerId: string): boolean => {
  const answers = getAnswers();
  const filtered = answers.filter(a => a.id !== answerId);
  if (filtered.length === answers.length) return false;
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(filtered));
  return true;
};

// ============ AUTH OPERATIONS ============

export const getCurrentUser = (): AuthenticatedUser | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: AuthenticatedUser | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const login = (email: string, password: string): AuthenticatedUser | null => {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) return null;
  
  let authenticatedUser: AuthenticatedUser;
  
  if (user.role === 'mentor') {
    const profile = getMentorProfileByUserId(user.id);
    if (!profile) return null;
    authenticatedUser = { ...user, role: 'mentor', profile } as MentorUser;
  } else if (user.role === 'mentee') {
    const profile = getMenteeProfileByUserId(user.id);
    if (!profile) return null;
    authenticatedUser = { ...user, role: 'mentee', profile } as MenteeUser;
  } else {
    authenticatedUser = { ...user, role: 'admin' } as AuthenticatedUser;
  }
  
  setCurrentUser(authenticatedUser);
  return authenticatedUser;
};

export const logout = (): void => {
  setCurrentUser(null);
};

// ============ ADMIN OPERATIONS ============

export const getVerificationRequests = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const getReports = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  return data ? JSON.parse(data) : [];
};

export const approveVerification = (mentorId: string): boolean => {
  const profile = getMentorProfileByUserId(mentorId);
  if (!profile) return false;
  updateMentorProfile(mentorId, { verificationStatus: 'verified', verificationBadge: true });
  return true;
};

export const rejectVerification = (mentorId: string): boolean => {
  const profile = getMentorProfileByUserId(mentorId);
  if (!profile) return false;
  updateMentorProfile(mentorId, { verificationStatus: 'rejected', verificationBadge: false });
  return true;
};

// ============ STATS OPERATIONS ============

export const getAdminStats = () => {
  const users = getUsers();
  const profiles = getMentorProfiles();
  const connections = getConnections();
  const messages = getMessages();
  const reports = getReports() as { status: string }[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    totalMentees: users.filter(u => u.role === 'mentee').length,
    totalMentors: users.filter(u => u.role === 'mentor').length,
    pendingVerifications: profiles.filter(p => p.verificationStatus === 'pending').length,
    activeChatsToday: messages.filter(m => new Date(m.createdAt) >= today).length,
    flaggedConversations: 0, // Would be populated by moderation system
    openReports: reports.filter(r => r.status === 'new' || r.status === 'in_review').length,
    totalConnections: connections.length,
    acceptedConnections: connections.filter(c => c.status === 'accepted').length
  };
};

export const getMentorStats = (mentorId: string) => {
  const connections = getConnectionsForUser(mentorId, 'mentor');
  const messages = getMessages();
  const answers = getAnswers();
  
  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  const mentorMessages = messages.filter(m => 
    acceptedConnections.some(c => c.id === m.connectionId)
  );
  
  return {
    activeMentees: acceptedConnections.length,
    pendingRequests: connections.filter(c => c.status === 'pending').length,
    totalMessages: mentorMessages.length,
    communityContributions: answers.filter(a => a.authorId === mentorId).length,
    averageRating: 4.5 // Mock rating for MVP
  };
};
