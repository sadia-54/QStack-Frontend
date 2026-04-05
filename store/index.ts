import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./auth/authSlice";
import myQuestionsReducer from "./question/myQuestionsSlice";
import questionFeedReducer from "./question/questionFeedSlice";
import questionVoteReducer from "./question/questionVoteSlice";
import userReducer from "./user/userSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer) as unknown as typeof authReducer;

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    questionVote: questionVoteReducer,
    questionFeed: questionFeedReducer,
    myQuestions: myQuestionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;