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
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar p-4">
        <div className="mb-6 text-lg font-semibold text-sidebar-foreground">
          TaskHub
        </div>

        <nav className="space-y-1 text-sm text-sidebar-foreground">
          <div className="rounded-md bg-sidebar-accent/70 px-2 py-1">
            Задачи
          </div>
          <div className="rounded-md px-2 py-1 text-sidebar-foreground/70">
            Календарь
          </div>
        </nav>

        <div className="mt-auto pt-4 text-xs text-sidebar-foreground/60">
          Учебный проект
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Личный кабинет
            </h1>
            <p className="text-xs text-muted-foreground">
              Здесь вы будете управлять задачами и календарём.
            </p>
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
