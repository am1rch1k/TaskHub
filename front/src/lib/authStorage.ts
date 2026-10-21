import type { AuthUser } from "../types/auth";

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("taskhub_user");
    if (!raw) return null;

    const user: unknown = JSON.parse(raw);
    if (
      typeof user === "object" &&
      user !== null &&
      "id" in user &&
      typeof user.id === "string" &&
      "username" in user &&
      typeof user.username === "string"
    ) {
      return user as AuthUser;
    }
  } catch {
    // Повреждённые данные не должны мешать открыть гостевой дашборд.
  }

  return null;
}
