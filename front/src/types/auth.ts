export interface AuthUser {
  id: string;
  username: string;
  name: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}
