import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionVoteState {
  userVotes: Record<number, 1 | -1>; // questionId -> vote value
}

const initialState: QuestionVoteState = {
  userVotes: {},
};

const questionVoteSlice = createSlice({
  name: "questionVote",
  initialState,
  reducers: {
    setVote: (state, action: PayloadAction<{ questionId: number; value: 1 | -1 }>) => {
      state.userVotes[action.payload.questionId] = action.payload.value;
    },
    removeVote: (state, action: PayloadAction<{ questionId: number }>) => {
      delete state.userVotes[action.payload.questionId];
    },
    clearVotes: (state) => {
      state.userVotes = {};
    },
  },
});

export const { setVote, removeVote, clearVotes } = questionVoteSlice.actions;
export default questionVoteSlice.reducer;
