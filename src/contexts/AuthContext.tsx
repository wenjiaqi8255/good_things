import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import type { User, AppUser, ClerkUserData } from '../types';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  // Remove login since Clerk handles this
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapClerkUser = (clerkUser: ClerkUserData): AppUser => {
  return {
    id: clerkUser.id,
    preferences: {
      theme: 'system',
      notifications: true
    },
    lastActiveAt: Date.now(),
    dialogHistory: [],
    clerkData: {
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      emailAddresses: clerkUser.emailAddresses
    }
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: clerkLoaded, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (!clerkLoaded) {
        return;
      }

      if (!clerkUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Map Clerk user data to our app's user format
        const userData = mapClerkUser({
          id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          emailAddresses: clerkUser.emailAddresses?.map(email => ({
            emailAddress: email.emailAddress
          }))
        });

        // Here you could fetch additional user data from your backend if needed
        // const response = await fetch('/api/users/profile', {
        //   headers: {
        //     'Authorization': `Bearer ${await clerkUser.getToken()}`
        //   }
        // });
        // const additionalData = await response.json();
        // userData.preferences = additionalData.preferences;

        setUser(userData);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [clerkUser, clerkLoaded]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}