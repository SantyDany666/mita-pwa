import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  isLoading: boolean;
  error: Error | null;
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { user, isLoading: storeLoading } = useAuthStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginWithGoogle = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setLocalLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLocalLoading(true);
      await authService.signOut();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    isLoading: storeLoading || localLoading,
    error,
    user,
    loginWithGoogle,
    signOut,
  };
};
