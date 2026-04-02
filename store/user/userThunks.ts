import { AppDispatch } from "../index";
import { setProfile, updateProfileBio, setLoading, setError, setActivity, setUserEmail } from "./userSlice";
import { getProfile, updateProfile, getUserActivity, changePassword, getMyProfile, uploadProfileImage } from "@/api/user";

export const fetchProfile =
  (userId: number) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const profile = await getProfile(userId);
      dispatch(setProfile(profile));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to fetch profile"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateUserProfile =
  (bio: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await updateProfile(bio);
      dispatch(updateProfileBio(bio));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to update profile"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchUserActivity =
  (userId: number) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const activities = await getUserActivity(userId);
      dispatch(setActivity(activities));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to fetch activity"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateUserPassword =
  (currentPassword: string, newPassword: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await changePassword(currentPassword, newPassword);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to change password"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchUserEmail =
  () =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const user = await getMyProfile();
      dispatch(setUserEmail(user.email));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to fetch user email"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const uploadProfileImageThunk =
  (file: File) =>
  async (dispatch: AppDispatch, getState: () => { auth: { currentUserId: number | null } }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await uploadProfileImage(file);
      // Re-fetch profile to get updated image from backend
      const state = getState();
      const userId = state.auth.currentUserId;
      if (userId) {
        const profile = await getProfile(userId);
        dispatch(setProfile(profile));
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to upload profile image"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
