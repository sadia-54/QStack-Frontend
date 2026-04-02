export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  profile_image?: string;
  bio?: string;
  reputation?: number;
}

// For public user listing (community members)
export interface UserSummaryPublic {
  id: number;
  username: string;
  bio: string;
  total_questions: number;
  total_answers: number;
  total_votes: number;
  created_at: string;
  profile_image?: string;
}

export interface Profile {
  id: number;
  username: string;
  bio: string;
  total_questions: number;
  total_answers: number;
  total_votes: number;
  preferred_tags?: string[];
  created_at?: string;
  profile_image?: string;
}

export interface ActivityItem {
  type: string; // question, answer, vote, edit, accept
  title?: string;
  target_id?: number;
  question_id?: number; // For answer activities, links to the question
  entity_type?: 'question' | 'answer'; // For vote/edit activities to indicate what was voted/edited
  value?: number;
  created_at: string;
}
