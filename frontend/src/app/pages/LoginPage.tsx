import { Link, useNavigate } from "react-router"; // Добавили useNavigate
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Добавили состояние загрузки

  const navigate = useNavigate(); // Умный роутер React для плавного перехода

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Блокируем кнопку, пока идет запрос

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Парсим ответ от сервера
      const data = await response.json();

      // 2. Обрабатываем ошибки (статусы 400, 401 из твоего OpenAPI)
      if (!response.ok) {
        // Берем текст ошибки из нашей схемы ErrorResponse (поле message)
        toast.error(data.message);
        return; // Останавливаем выполнение функции
      }

      // 3. Обрабатываем успех (статус 200)
      // Берем токен из схемы AuthResponse и прячем в сейф браузера
      localStorage.setItem("token", data.data.token);

      toast.success("Вход выполнен успешно!");

      // 4. Плавно переводим пользователя в дашборд (без перезагрузки экрана)
      navigate("/dashboard");

    } catch (error) {
      // Это сработает, если сервер вообще упал или нет интернета
      toast.error("Произошла ошибка сети. Сервер недоступен.");
    } finally {
      setIsLoading(false); // В любом случае разблокируем кнопку
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Вход в FreelanceHub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled={isLoading} />
                  <span>Запомнить меня</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Забыли пароль?
                </a>
              </div> */}

              {/* Умная кнопка, которая меняет текст и блокируется при загрузке */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Выполняется вход..." : "Войти"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Нет аккаунта? </span>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </form>

            {/* Код с соцсетями (Google/Facebook) оставляем без изменений */}
            {/* ... */}
          </CardContent>
        </Card>
      </div>

    
    </div>
  );
}