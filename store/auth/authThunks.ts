import { AppDispatch } from "../index";
import { loginSuccess, logout } from "./authSlice";
import { loginApi } from "@/api/auth";

export const loginUser =
  (identifier: string, password: string) =>
  async (dispatch: AppDispatch) => {
    const data = await loginApi({ identifier, password });

    dispatch(
      loginSuccess({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
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
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
        })
      );
    }
  };
