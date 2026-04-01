import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Question } from "@/types/question";
import { getMyQuestions as getMyQuestionsApi } from "@/api/question";
import { RootState, AppDispatch } from "@/store";

interface MyQuestionsState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  limit: number;
}

const initialState: MyQuestionsState = {
  questions: [],
  isLoading: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 20,
};

export const fetchMyQuestions = createAsyncThunk<
  Question[],
  { limit?: number; offset?: number },
  { state: RootState; dispatch: AppDispatch }
>("myQuestions/fetchMyQuestions", async (params, { rejectWithValue }) => {
  try {
    const data = await getMyQuestionsApi(params);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch my questions");
  }
});

const myQuestionsSlice = createSlice({
  name: "myQuestions",
  initialState,
  reducers: {
    clearMyQuestions: (state) => {
      state.questions = [];
      state.offset = 0;
      state.hasMore = true;
      state.error = null;
    },
    setMyQuestionsParams: (state, action: PayloadAction<{ limit?: number }>) => {
      if (action.payload.limit) {
        state.limit = action.payload.limit;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyQuestions.fulfilled, (state, action) => {
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
      .addCase(fetchMyQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.hasMore = false;
      });
  },
});

export const { clearMyQuestions, setMyQuestionsParams } = myQuestionsSlice.actions;
export default myQuestionsSlice.reducer;
