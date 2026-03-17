import { AppDispatch } from "../index";
import { loginSuccess, logout, setCurrentUserId } from "./authSlice";
import { loginApi } from "@/api/auth";
import { decodeJWT } from "@/utils/jwt";

const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  // Try multiple common JWT claim names for user ID
  const userId = decoded?.sub ?? decoded?.user_id ?? decoded?.userId ?? decoded?.id ?? null;
  return userId ? Number(userId) : null;
};

export const loginUser =
  (identifier: string, password: string) =>
  async (dispatch: AppDispatch) => {
    const data = await loginApi({ identifier, password });

    // Decode JWT to get user ID
    const userId = getUserIdFromToken(data.access_token);

    dispatch(
      loginSuccess({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userId: userId ?? undefined,
      })
    );

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  };

export const logoutUser =
  () => (dispatch: AppDispatch) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(logout());
  };

export const initializeAuth =
  () => (dispatch: AppDispatch) => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      const userId = getUserIdFromToken(accessToken);

      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
          userId: userId ?? undefined,
        })
      );
    }
  };
