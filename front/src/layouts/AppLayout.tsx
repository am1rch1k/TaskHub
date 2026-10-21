import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../lib/authStorage";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const user = getStoredUser();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">TaskHub</h1>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="text-xs text-muted-foreground">
                Пользователь: <span className="font-medium">{user.username}</span>
              </div>
            ) : (
              <nav className="flex items-center gap-3 text-sm" aria-label="Авторизация">
                <Link to="/login" className="font-medium text-foreground hover:underline">
                  Войти
                </Link>
                <Link to="/register" className="rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90">
                  Регистрация
                </Link>
              </nav>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
