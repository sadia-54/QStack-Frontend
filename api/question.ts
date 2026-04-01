import { CreateQuestionRequest, FeedQueryParams, VoteQuestionRequest, TagStat, CommunityStats } from "../types/question";

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
  payload: CreateQuestionRequest
) => {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create question");
  }

  return data;
};

export const updateQuestion = async (
  id: number,
  payload: CreateQuestionRequest
) => {
  const res = await fetch(`${BASE_URL}/questions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update question");
  }

  return data;
};

export const deleteQuestion = async (id: number) => {
  const res = await fetch(`${BASE_URL}/questions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete question");
  }

  return data;
};

export const voteQuestion = async (
  id: number,
  payload: VoteQuestionRequest
) => {
  const res = await fetch(`${BASE_URL}/questions/${id}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to vote");
  }

  return data;
};

export const getMyFeed = async (
  params?: { limit?: number; offset?: number }
) => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.offset) searchParams.append("offset", params.offset.toString());

  const queryString = searchParams.toString();
  const url = `${BASE_URL}/questions/my-feed${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my feed");
  }

  return res.json();
};

export const getMyQuestions = async (
  params?: { limit?: number; offset?: number }
) => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.offset) searchParams.append("offset", params.offset.toString());

  const queryString = searchParams.toString();
  const url = `${BASE_URL}/questions/my${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my questions");
  }

  return res.json();
};

export const getPopularTags = async (): Promise<TagStat[]> => {
  const res = await fetch(`${BASE_URL}/tags/popular`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch popular tags");
  }

  return res.json();
};

export const getCommunityStats = async (): Promise<CommunityStats> => {
  const res = await fetch(`${BASE_URL}/users/community/stats`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch community stats");
  }

  return res.json();
};