import { CreateCommentRequest, UpdateCommentRequest, Comment } from "../types/comment";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getCommentsByAnswer = async (answerId: number): Promise<Comment[]> => {
  const res = await fetch(`${BASE_URL}/comments/answer/${answerId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
};

export const createComment = async (
  answerId: number,
  payload: CreateCommentRequest,
  accessToken: string
) => {
  const res = await fetch(`${BASE_URL}/comments/answer/${answerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create comment");
  }

  return data;
};

export const updateComment = async (
  commentId: number,
  payload: UpdateCommentRequest,
  accessToken: string
) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update comment");
  }

  return data;
};

export const deleteComment = async (commentId: number, accessToken: string) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete comment");
  }

  return res.json();
};
