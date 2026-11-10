import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMe, login, logout, register, updateProfile, type ProfilePhoto } from './authApi';
import type { LoginFormValues } from '@/src/features/auth/schemas/loginSchema';
import type { RegisterFormValues } from '@/src/features/auth/schemas/registerSchema';
import type { ProfileFormValues } from '@/src/features/auth/schemas/profileSchema';
import type { AuthUser } from '@/src/features/auth/types/auth';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export function useMe(enabled = true) {
  return useQuery({ queryKey: authQueryKeys.me, queryFn: getMe, enabled, retry: false });
}

export function useLogin() {
  return useMutation({ mutationFn: (values: LoginFormValues) => login(values) });
}

export function useRegister() {
  return useMutation({ mutationFn: (values: RegisterFormValues) => register(values) });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ values, avatar }: { values: ProfileFormValues; avatar?: ProfilePhoto }) => updateProfile(values, avatar),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData<AuthUser>(authQueryKeys.me, { ...user, bio: user.bio?.trim() || null });
    },
  });
}
