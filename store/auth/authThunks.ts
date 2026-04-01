import { AppDispatch } from "../index";
import { loginSuccess, logout, setCurrentUserId, authInitialized } from "./authSlice";
import { loginApi } from "@/api/auth";

export const loginUser =
  (identifier: string, password: string) =>
  async (dispatch: AppDispatch) => {
    await loginApi({ identifier, password });

    // Fetch current user to get user ID from the authenticated session
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let userId: number | null = null;
    if (userRes.ok) {
      const user = await userRes.json();
      userId = user.id ?? user.user_id ?? null;
    }

    dispatch(
      loginSuccess({
        accessToken: "cookie",
        refreshToken: "cookie",
        userId: userId ?? undefined,
      })
    );
  };

export const logoutUser =
  () => async (dispatch: AppDispatch) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      // Ignore errors, still clear local state
    }
    dispatch(logout());
  };

export const initializeAuth =
  () => async (dispatch: AppDispatch) => {
    // Check if user is authenticated by fetching current user
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const user = await res.json();
        const userId = user.id ?? user.user_id ?? null;

        dispatch(
          loginSuccess({
            accessToken: "cookie",
            refreshToken: "cookie",
            userId: userId ?? undefined,
          })
        );
      }
    } catch (err) {
      // Not authenticated, leave state as is
    } finally {
      // Always mark initialization as complete
      dispatch(authInitialized());
    }
  };
