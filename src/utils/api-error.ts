export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (!error || typeof error !== "object") return fallback;
  if ("message" in error && typeof error.message === "string") return error.message;
  if ("data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") return data.message;
  }
  if ("error" in error && typeof error.error === "string") return error.error;
  return fallback;
}
