export interface UserSummary {
  id: number;
  username: string;
}

export interface Comment {
  id: number;
  body: string;
  author: UserSummary;
  created_at: string;
}

export interface CreateCommentRequest {
  body: string;
}

export interface UpdateCommentRequest {
  body?: string;
}
