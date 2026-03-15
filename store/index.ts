import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import questionVoteReducer from "./question/questionVoteSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    questionVote: questionVoteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;