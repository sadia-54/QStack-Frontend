import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "@/types/question";
import { getMyFeed as getMyFeedApi } from "@/api/question";
import { RootState, AppDispatch } from "@/store";

interface QuestionFeedState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  limit: number;
}

const initialState: QuestionFeedState = {
  questions: [],
  isLoading: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 20,
};

export const fetchMyFeed = createAsyncThunk<
  Question[],
  { limit?: number; offset?: number },
  { state: RootState; dispatch: AppDispatch }
>("questionFeed/fetchMyFeed", async (params, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const accessToken = state.auth.accessToken;

    const data = await getMyFeedApi(params, accessToken);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch feed");
  }
});

const questionFeedSlice = createSlice({
  name: "questionFeed",
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.questions = [];
      state.offset = 0;
      state.hasMore = true;
      state.error = null;
    },
    setFeedParams: (state, action: PayloadAction<{ limit?: number }>) => {
      if (action.payload.limit) {
        state.limit = action.payload.limit;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.length < state.limit) {
          state.hasMore = false;
        }
        
        if (state.offset === 0) {
          state.questions = action.payload;
        } else {
          state.questions = [...state.questions, ...action.payload];
        }
        
        state.offset += action.payload.length;
      })
      .addCase(fetchMyFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.hasMore = false;
      });
  },
});

export const { clearFeed, setFeedParams } = questionFeedSlice.actions;
export default questionFeedSlice.reducer;
