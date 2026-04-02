import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Profile, ActivityItem } from "@/types/user";

interface UserState {
  currentUser: User | null;
  profile: Profile | null;
  activities: ActivityItem[];
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  profile: null,
  activities: [],
  userEmail: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.profile = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    updateProfileBio: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.bio = action.payload;
      }
    },
    setActivity: (state, action: PayloadAction<ActivityItem[]>) => {
      state.activities = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setProfile,
  updateProfileBio,
  setActivity,
  setUserEmail,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
