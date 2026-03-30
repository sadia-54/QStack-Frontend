import { User, Profile, ActivityItem } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/users/`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};

export const getProfile = async (userId: number): Promise<Profile> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

export const updateProfile = async (bio: string): Promise<{ message: string }> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bio }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to update profile");
  }
  return response.json();
};

export const getUserActivity = async (userId: number): Promise<ActivityItem[]> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${BASE_URL}/users/${userId}/activity`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch activity");
  }
  return response.json();
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to change password");
  }
  return response.json();
};

export const getMyProfile = async (): Promise<User> => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch profile");
  }
  return response.json();
};
