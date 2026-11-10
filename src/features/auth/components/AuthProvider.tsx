import { useQueryClient } from '@tanstack/react-query';
import { router, useSegments } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useLogin, useLogout, useMe } from '@/src/features/auth/api/authHooks';
import { clearStoredAuthToken, getStoredAuthToken, storeAuthToken } from '@/src/features/auth/api/authStorage';
import type { LoginFormValues } from '@/src/features/auth/schemas/loginSchema';
import type { AuthSession, AuthUser } from '@/src/features/auth/types/auth';
import { setUnauthorizedHandler } from '@/src/shared/lib/api';
import { authQueryKeys } from '@/src/features/auth/api/authHooks';
import LoadingState from '@/src/shared/components/LoadingState';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (values: LoginFormValues) => Promise<void>;
  signOut: () => Promise<void>;
  establishSession: (session: AuthSession) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [initialUser, setInitialUser] = useState<AuthUser | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const meQuery = useMe(Boolean(token) && !isTokenLoading);

  useEffect(() => {
    let active = true;
    getStoredAuthToken()
      .then((storedToken) => {
        if (active) setToken(storedToken);
      })
      .catch(() => {
        if (active) setToken(null);
      })
      .finally(() => {
        if (active) setIsTokenLoading(false);
      });

    return () => { active = false; };
  }, []);

  const expireSession = useCallback(async () => {
    await clearStoredAuthToken();
    queryClient.clear();
    setToken(null);
    setInitialUser(null);
    router.replace('/login');
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(expireSession);
    return () => setUnauthorizedHandler(null);
  }, [expireSession]);

  useEffect(() => {
    if (meQuery.data) setInitialUser(meQuery.data);
  }, [meQuery.data]);

  const establishSession = useCallback(async (session: AuthSession) => {
    queryClient.clear();
    await storeAuthToken(session.token);
    setInitialUser(session.user);
    setToken(session.token);
    queryClient.setQueryData(authQueryKeys.me, session.user);
  }, [queryClient]);

  const signIn = useCallback(async (values: LoginFormValues) => {
    queryClient.clear();
    const session = await loginMutation.mutateAsync(values);
    await establishSession(session);
  }, [establishSession, loginMutation, queryClient]);

  const signOut = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // A falha de rede não impede a remoção local da sessão.
    } finally {
      await clearStoredAuthToken();
      queryClient.clear();
      setInitialUser(null);
      setToken(null);
      router.replace('/login');
    }
  }, [logoutMutation, queryClient]);

  const value = useMemo<AuthContextValue>(() => ({
    user: token ? (meQuery.data ?? initialUser) : null,
    isLoading: isTokenLoading || (Boolean(token) && meQuery.isLoading && !meQuery.data),
    signIn,
    signOut,
    establishSession,
  }), [establishSession, initialUser, isTokenLoading, meQuery.data, meQuery.isLoading, signIn, signOut, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const isAuthRoute = segments[0] === 'login' || segments[0] === 'cadastro';

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isAuthRoute) router.replace('/login');
    if (user && isAuthRoute) router.replace('/(tabs)');
  }, [isAuthRoute, isLoading, user]);

  if (isLoading) return <LoadingState message="Verificando sua sessão..." />;
  if (!user && !isAuthRoute) return <LoadingState message="Redirecionando para o login..." />;
  if (user && isAuthRoute) return <LoadingState message="Abrindo sua conta..." />;

  return children;
}
