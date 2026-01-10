import { useState } from 'react';
import { authService } from '../services/auth.service';

interface UseAuthReturn {
  isLoading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signInWithGoogle();
      // Note: No need to set loading to false on success as the app redirects
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  };

  const logout = async () => {
      try {
        setIsLoading(true);
        await authService.signOut();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

  return {
    isLoading,
    error,
    loginWithGoogle,
    logout,
  };
};
