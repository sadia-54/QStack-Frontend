import { LoginRequest, SignupRequest, AuthResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export const signupApi = async (
  payload: SignupRequest
): Promise<{ message: string; verify_url: string }> => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
};