import { User, Profile, ActivityItem, UserSummaryPublic } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all community members (public user listing)
export const getCommunityMembers = async (): Promise<UserSummaryPublic[]> => {
  const response = await fetch(`${BASE_URL}/users`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch community members");
  }
  return response.json();
};

// Get public profile by user ID
export const getUserProfile = async (id: number): Promise<Profile> => {
  const response = await fetch(`${BASE_URL}/users/${id}/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

// Alias for backward compatibility
export const getProfile = getUserProfile;

export const updateProfile = async (bio: string): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ bio }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to update profile");
  }
  return response.json();
};

export const getUserActivity = async (userId: number): Promise<ActivityItem[]> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/activity`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const response = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to change password");
  }
  return response.json();
};

export const getMyProfile = async (): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch profile");
  }
  return response.json();
};
