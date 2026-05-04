import { Link, useNavigate } from "react-router"; // Добавляем useNavigate
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const navigate = useNavigate(); // Роутер

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка паролей (остается только на фронтенде)
    if (formData.password !== formData.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setIsLoading(true); // Блокируем форму

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // Отправляем реальный запрос на сервер (эндпоинт регистрации)
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Важно: мы не отправляем confirmPassword на сервер!
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status == 409) {
        toast.error("Пользователь с таким email уже существует");
      }
      else if (response.status == 400) {
        toast.error("ошибка валидации (короткий пароль, но это не точно)");
        return;
      }


      // Обрабатываем ошибки (например, 409 Конфликт - email уже занят)
      else if (!response.ok) {
        toast.error(response.status + " undefined error");
        return;
      }


      // Успех! Сервер вернул 201 и токен
      localStorage.setItem("token", data.data.token);
      toast.success("Регистрация успешна! Добро пожаловать.");

      // Переводим пользователя в дашборд
      navigate("/dashboard");

    } catch (error) {
      toast.error("Произошла ошибка сети. Сервер недоступен.");
    } finally {
      setIsLoading(false); // Разблокируем форму
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Регистрация в FreelanceHub
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Один аккаунт для заказа и предложения услуг
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя и фамилия</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" required disabled={isLoading} />
                <span className="text-gray-600">
                  Я согласен с{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    условиями использования
                  </a>{" "}
                  и{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    политикой конфиденциальности
                  </a>
                </span>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Уже есть аккаунт? </span>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Войти
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}