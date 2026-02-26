import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse } from "@/types/auth";

const initialState: AuthResponse = {
  access_token: "",
  refresh_token: "",
  token_type: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.access_token = action.payload.accessToken;
      state.refresh_token = action.payload.refreshToken;
      state.token_type = "Bearer";
    },
    logout: (state) => {
      state.access_token = "";
      state.refresh_token = "";
      state.token_type = "";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;