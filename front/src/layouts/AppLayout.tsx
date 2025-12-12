import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { AuthUser } from "../types/auth";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("taskhub_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      } catch {
        // если что-то не так - просто игнор
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">TaskHub</h1>
            {/* <p className="text-xs text-muted-foreground">
              Здесь вы будете управлять задачами и календарём.
            </p> */}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Пользователь:{" "}
              <span className="font-medium">
                {user?.username ?? "не авторизован"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
