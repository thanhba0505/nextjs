import { API_BASE_PATH } from "@/constants/api";

function readPublicEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
}

export const env = {
  apiUrl: readPublicEnv("NEXT_PUBLIC_API_URL") ?? "http://localhost:3000",
  apiBasePath: API_BASE_PATH,
} as const;
