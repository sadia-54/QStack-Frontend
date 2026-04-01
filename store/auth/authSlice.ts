import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentUserId: number | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentUserId: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; userId?: number }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.currentUserId = action.payload.userId ?? null;
      state.isLoading = false;
      state.error = null;
      state.isInitializing = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isInitializing = false;
    },
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.currentUserId = null;
      state.isLoading = false;
      state.error = null;
      state.isInitializing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUserId: (state, action: PayloadAction<number>) => {
      state.currentUserId = action.payload;
    },
    authInitialized: (state) => {
      state.isInitializing = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  clearError,
  setCurrentUserId,
  authInitialized,
} = authSlice.actions;
export default authSlice.reducer;