'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { UserProfile, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(userRef);
            
            if (!docSnap.exists()) {
              await setDoc(userRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Anonymous',
                photoURL: firebaseUser.photoURL || null,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
              });
            } else {
              // Update last login time
              await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            }

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL || undefined
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Auth state error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (newUser) {
        await updateProfile(newUser, { displayName });
      }
      
      return newUser;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err : new Error('Failed to create account'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err : new Error('Failed to send password reset email'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
