import { CreateAnswerRequest, UpdateAnswerRequest } from "../types/answer";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAnswersByQuestion = async (questionId: number) => {
  const res = await fetch(`${BASE_URL}/answers/question/${questionId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch answers");
  }

  return res.json();
};

export const createAnswer = async (
  questionId: number,
  payload: CreateAnswerRequest,
  accessToken: string
) => {
  const res = await fetch(`${BASE_URL}/answers/question/${questionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create answer");
  }

  return data;
};

export const updateAnswer = async (
  answerId: number,
  payload: UpdateAnswerRequest,
  accessToken: string
) => {
  const res = await fetch(`${BASE_URL}/answers/${answerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update answer");
  }

  return data;
};

export const deleteAnswer = async (answerId: number, accessToken: string) => {
  const res = await fetch(`${BASE_URL}/answers/${answerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete answer");
  }

  return res.json();
};

export const acceptAnswer = async (answerId: number, accessToken: string) => {
  const res = await fetch(`${BASE_URL}/answers/${answerId}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to accept answer");
  }

  return res.json();
};
