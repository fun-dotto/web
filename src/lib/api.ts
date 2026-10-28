import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@/types/api";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-id-token")?.value;
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

const appCheckMiddleware: Middleware = {
  async onRequest({ request }) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-app-check-token")?.value;
    if (token) {
      request.headers.set("X-Firebase-AppCheck", token);
    }
    return request;
  },
};

export const api = createClient<paths>({
  baseUrl: process.env.API_BASE_URL,
  querySerializer: {
    array: { style: "form", explode: false },
  },
});

api.use(appCheckMiddleware);
api.use(authMiddleware);
