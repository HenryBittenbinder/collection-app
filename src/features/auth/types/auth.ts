export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}
