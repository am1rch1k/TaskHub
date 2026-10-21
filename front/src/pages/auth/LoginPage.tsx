import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/apiClient";
import type { AuthResponse } from "../../types/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<AuthResponse>("/api/auth/login", {
        username,
        password,
      });

      if (!response.success || !response.user) {
        setError(response.message ?? "Не удалось выполнить вход");
        return;
      }

      // сохраняем пользователя во фронте
      localStorage.setItem("taskhub_user", JSON.stringify(response.user));

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при обращении к серверу"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Вход</h2>
        <p className="text-sm text-muted-foreground">
          Введите логин и пароль, чтобы войти в личный кабинет.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Логин</Label>
          <Input
            id="username"
            placeholder="your_login"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Ваш пароль"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Входим..." : "Войти"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Нет аккаунта?{" "}
        <Link
          to="/register"
          className="font-medium text-primary underline underline-offset-2"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
