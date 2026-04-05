"use client";

import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only redirect if initialization is complete and user is not authenticated
    if (!isInitializing && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isInitializing, router]);

  // Show nothing while initializing or if not authenticated
  if (isInitializing || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
