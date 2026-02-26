import { AppDispatch } from "../index";
import { loginSuccess } from "./authSlice";
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