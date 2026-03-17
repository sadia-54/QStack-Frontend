"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    // Read RAW query string exactly as given in URL 
    const rawQuery = window.location.search;

    // Extract token 
    const tokenMatch = rawQuery.match(/token=([^&]*)/);
    const rawToken = tokenMatch ? tokenMatch[1] : null;

    if (!rawToken) {
      setMessage("Invalid verification link");
      return;
    }

    // Send raw
    fetch(`http://localhost:8080/api/v1/auth/verify-email?token=${rawToken}`)
      .then(async (res) => {
        const data = await res.json();
        setMessage(data.message || data.error);
      })
      .catch(() => setMessage("Verification failed"));
  }, []);

  return <div style={{ padding: 20, fontSize: 18 }}>{message}</div>;
}