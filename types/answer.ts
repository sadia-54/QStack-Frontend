export interface Answer {
  id: number;
  description: string;
  is_accepted: boolean;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateAnswerRequest {
  description: string;
}

export interface UpdateAnswerRequest {
  description?: string;
}
