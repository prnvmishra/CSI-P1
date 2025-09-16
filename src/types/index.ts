import { User as FirebaseUser } from 'firebase/auth';

// User-related types
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: Date;
  lastLogin?: Date;
}

// Auth context type
export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}

// Style/Effect types
export interface StyleCommand {
  type: string;
  value: string | number | boolean;
  target?: string;
}

export interface Effect {
  name: string;
  options: Record<string, any>;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';
