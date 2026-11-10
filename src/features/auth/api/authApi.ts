import api from '@/src/shared/lib/api';
import type { AuthSession, AuthUser } from '@/src/features/auth/types/auth';
import type { LoginFormValues } from '@/src/features/auth/schemas/loginSchema';
import type { RegisterFormValues } from '@/src/features/auth/schemas/registerSchema';
import type { ProfileFormValues } from '@/src/features/auth/schemas/profileSchema';

type SessionResponse = { data: AuthSession };
type UserResponse = { data: AuthUser };
type UpdatedUserResponse = { data: AuthUser | { user: AuthUser } };
export type ProfilePhoto = { uri: string; fileName?: string | null; mimeType?: string | null };

export async function login(values: LoginFormValues): Promise<AuthSession> {
  const response = await api.post<SessionResponse>('/login', values);
  return response.data.data;
}

export async function register(values: RegisterFormValues): Promise<AuthSession> {
  const response = await api.post<SessionResponse>('/register', values);
  return response.data.data;
}

export async function logout(): Promise<void> {
  await api.post('/logout');
}

export async function getMe(): Promise<AuthUser> {
  const response = await api.get<UserResponse>('/me');
  return response.data.data;
}

export async function updateProfile(values: ProfileFormValues, avatar?: ProfilePhoto): Promise<AuthUser> {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('username', values.username);
  formData.append('bio', values.bio.trim());

  if (avatar) {
    formData.append('avatar', {
      uri: avatar.uri,
      name: avatar.fileName ?? avatar.uri.split('/').pop() ?? 'avatar.jpg',
      type: avatar.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
  }

  formData.append('_method', 'PUT');
  const response = await api.post<UpdatedUserResponse>('/me', formData);
  const result = response.data.data;
  return 'user' in result ? result.user : result;
}
