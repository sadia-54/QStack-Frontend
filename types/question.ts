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