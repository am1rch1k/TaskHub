import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/apiClient";
import type { AuthResponse } from "../../types/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const response = await api.post<AuthResponse>("/api/auth/register", {
        username,
        password,
        name: name || undefined,
      });

      if (!response.success || !response.user) {
        setError(response.message ?? "Не удалось создать аккаунт");
        return;
      }

      // Можно сразу логинить, но для простоты отправим на /login
      navigate("/login");
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
        <h2 className="text-lg font-medium">Регистрация</h2>
        <p className="text-sm text-muted-foreground">
          Создайте аккаунт, чтобы управлять своими задачами.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя (необязательно)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Как к вам обращаться"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Логин</Label>
          <Input
            id="username"
            type="text"
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
            placeholder="Придумайте пароль"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Создаём..." : "Создать аккаунт"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="font-medium text-primary underline underline-offset-2"
        >
          Войти
        </Link>
      </p>
    </div>
  );
}
