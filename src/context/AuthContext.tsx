'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthenticatedUser, MenteeUser, MentorUser, AdminUser } from '@/lib/types';
import { 
  initializeData, 
  getCurrentUser, 
  setCurrentUser, 
  login as authLogin, 
  logout as authLogout,
  createUser,
  createMentorProfile,
  createMenteeProfile,
  generateId,
  getTimestamp
} from '@/lib/utils';
import { MenteeSignupData, MentorSignupData } from '@/lib/types';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signupMentee: (data: MenteeSignupData) => Promise<{ success: boolean; error?: string }>;
  signupMentor: (data: MentorSignupData) => Promise<{ success: boolean; error?: string }>;
  updateCurrentUser: (user: AuthenticatedUser) => void;
  isMentee: () => boolean;
  isMentor: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data and restore user session
    initializeData();
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authenticatedUser = authLogin(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const signupMentee = async (data: MenteeSignupData) => {
    try {
      const userId = `mentee-${generateId()}`;
      const timestamp = getTimestamp();

      // Create user
      const newUser = createUser({
        id: userId,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'mentee',
        createdAt: timestamp,
        updatedAt: timestamp
      });

      // Create mentee profile
      const profile = createMenteeProfile({
        userId,
        class: data.class,
        targetColleges: data.targetColleges,
        exams: data.exams,
        interests: data.interests,
        goalsText: data.goalsText
      });

      // Create authenticated user object
      const authenticatedUser: MenteeUser = {
        ...newUser,
        role: 'mentee',
        profile
      };

      setCurrentUser(authenticatedUser);
      setUser(authenticatedUser);

      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const signupMentor = async (data: MentorSignupData) => {
    try {
      const userId = `mentor-${generateId()}`;
      const timestamp = getTimestamp();

      // Create user
      const newUser = createUser({
        id: userId,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'mentor',
        createdAt: timestamp,
        updatedAt: timestamp
      });

      // Create mentor profile
      const profile = createMentorProfile({
        userId,
        college: data.college,
        major: data.major,
        minor: data.minor,
        year: data.year,
        city: data.city,
        state: data.state,
        languages: data.languages,
        topics: data.topics,
        bio: data.bio,
        verificationStatus: 'pending',
        verificationBadge: false,
        faqs: []
      });

      // Create authenticated user object
      const authenticatedUser: MentorUser = {
        ...newUser,
        role: 'mentor',
        profile
      };

      setCurrentUser(authenticatedUser);
      setUser(authenticatedUser);

      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const updateCurrentUser = (updatedUser: AuthenticatedUser) => {
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  const isMentee = () => user?.role === 'mentee';
  const isMentor = () => user?.role === 'mentor';
  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      signupMentee,
      signupMentor,
      updateCurrentUser,
      isMentee,
      isMentor,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Type guards for narrowing user type
export function isMenteeUser(user: AuthenticatedUser | null): user is MenteeUser {
  return user?.role === 'mentee';
}

export function isMentorUser(user: AuthenticatedUser | null): user is MentorUser {
  return user?.role === 'mentor';
}

export function isAdminUser(user: AuthenticatedUser | null): user is AdminUser {
  return user?.role === 'admin';
}
