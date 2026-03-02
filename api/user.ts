import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/api/users/`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/api/users/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};
