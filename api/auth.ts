import { LoginRequest, SignupRequest, AuthResponse, ForgotPasswordRequest } from "@/types/auth";

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

export const forgotPasswordApi = async (
  payload: ForgotPasswordRequest
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to send reset email");
  }

  return data;
};

export const resetPasswordApi = async (
  payload: { token: string; new_password: string }
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to reset password");
  }

  return data;
};