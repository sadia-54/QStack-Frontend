import { CreateQuestionRequest } from "../types/question";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getQuestionFeed = async () => {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
};

export const createQuestion = async (
  payload: CreateQuestionRequest,
  accessToken: string
) => {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create question");
  }

  return data;
};