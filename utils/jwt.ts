export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const decoded = decodeJWT(token);
  // Try multiple common JWT claim names for user ID
  const userId = decoded?.sub ?? decoded?.user_id ?? decoded?.userId ?? decoded?.id ?? null;
  return userId ? Number(userId) : null;
};
