import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import questionVoteReducer from "./question/questionVoteSlice";
import questionFeedReducer from "./question/questionFeedSlice";
import myQuestionsReducer from "./question/myQuestionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    questionVote: questionVoteReducer,
    questionFeed: questionFeedReducer,
    myQuestions: myQuestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
