import { API_BASE_PATH } from "@/constants/api";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const env = {
  apiUrl:
    typeof publicApiUrl === "string" && publicApiUrl.length > 0
      ? publicApiUrl
      : "http://localhost:3000",
  apiBasePath: API_BASE_PATH,
} as const;
