import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Cpu } from 'lucide-react';
import { router } from './routes/router';
import { useAuthStore } from './stores/authStore';
import { authApi } from './api/endpoints/auth';
import { profileApi } from './api/endpoints/profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute default staleTime
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const { getRefreshToken, setAuth, setUser, clearAuth, setInitialized, isInitialized } = useAuthStore();
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setInitialized(true);
        setBootstrapping(false);
        return;
      }

      try {
        // Silently restore session using refresh token on app boot
        const tokenRes = await authApi.refreshToken(refreshToken);
        setAuth(tokenRes.access, tokenRes.refresh);

        // Fetch user profile to restore user state
        try {
          const userProfile = await profileApi.getProfile();
          setUser({
            id: userProfile.id,
            username: userProfile.username,
            email: userProfile.email,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
          });
        } catch {
          // If profile fetch fails, user info can still be fetched later
        }
      } catch {
        // Token refresh failed or token expired
        clearAuth();
      } finally {
        setInitialized(true);
        setBootstrapping(false);
      }
    }

    restoreSession();
  }, [getRefreshToken, setAuth, setUser, clearAuth, setInitialized]);

  if (bootstrapping && !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-amber-400 mb-4 animate-pulse">
          <Cpu className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold tracking-tight font-heading">
          Buy<span className="text-amber-400">Yantra</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Initializing equipment storefront...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
