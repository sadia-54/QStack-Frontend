import { AppDispatch } from "../index";
import { setProfile, updateProfileBio, setLoading, setError } from "./userSlice";
import { getProfile, updateProfile } from "@/api/user";

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
