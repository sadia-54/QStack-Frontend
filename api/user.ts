import { User, Profile, ActivityItem, UserSummaryPublic } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Extract base server URL without the /api/v1 prefix for static assets
const SERVER_BASE_URL = BASE_URL?.replace('/api/v1', '') || '';

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
  const data = await response.json();
  // Ensure the profile_image URL is absolute (using server base URL for static assets)
  if (data.profile_image && !data.profile_image.startsWith('http')) {
    data.profile_image = `${SERVER_BASE_URL}${data.profile_image}`;
  }
  return data;
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
  const data = await response.json();
  // Ensure the profile_image URL is absolute (using server base URL for static assets)
  if (data.profile_image && !data.profile_image.startsWith('http')) {
    data.profile_image = `${SERVER_BASE_URL}${data.profile_image}`;
  }
  return data;
};

export const uploadProfileImage = async (file: File): Promise<{ profile_image: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/users/profile/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to upload profile image");
  }
  const data = await response.json();
  // Ensure the profile_image URL is absolute (using server base URL for static assets)
  if (data.profile_image && !data.profile_image.startsWith('http')) {
    data.profile_image = `${SERVER_BASE_URL}${data.profile_image}`;
  }
  return data;
};
