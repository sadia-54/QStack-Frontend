export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  bio?: string;
  reputation?: number;
}
