import { CreateQuestionRequest, FeedQueryParams } from "../types/question";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const buildQueryString = (params: FeedQueryParams): string => {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append("search", params.search);
  if (params.tag) searchParams.append("tag", params.tag);
  if (params.sort) {
    // Map frontend sort options to backend expected values
    const sortValue = params.sort === "oldest" ? "date" : params.sort;
    searchParams.append("sort", sortValue);
  }
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.offset) searchParams.append("offset", params.offset.toString());

  return searchParams.toString();
};

export const getQuestionFeed = async (params?: FeedQueryParams) => {
  const queryString = params ? buildQueryString(params) : "";
  const url = `${BASE_URL}/questions${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
};

export const getQuestionById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/questions/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch question");
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