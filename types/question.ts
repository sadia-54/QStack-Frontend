export interface Question {
  id: number;
  title: string;
  description: string;
  vote_count: number;
  answer_count: number;
  author: {
    id: number;
    username: string;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionRequest {
  title: string;
  description: string;
  tags: string[];
}

export type SortOption = "newest" | "oldest" | "votes";

export interface FeedQueryParams {
  search?: string;
  tag?: string;
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

export interface FeedResponse {
  questions: Question[];
  total: number;
}