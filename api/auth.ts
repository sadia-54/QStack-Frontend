import { LoginRequest, AuthResponse } from "@/types/auth";

const BASE_URL = "http://localhost:8080/api/v1";

export const loginApi = async (
  payload: LoginRequest
): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};