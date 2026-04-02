"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/store/auth/authThunks";
import { AppDispatch } from "@/store";

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}