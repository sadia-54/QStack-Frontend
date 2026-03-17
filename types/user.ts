export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  bio?: string;
  reputation?: number;
}

export interface Profile {
  id: number;
  username: string;
  bio: string;
  total_questions: number;
  total_answers: number;
  total_votes: number;
  preferred_tags?: string[];
}
