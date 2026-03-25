import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Search,
  Briefcase,
  Shield,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Award,
} from "lucide-react";
import { useState } from "react";

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6">
              Найдите идеального фрилансера для вашего проекта
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Тысячи проверенных специалистов готовы помочь вам реализовать любую
              задачу
            </p>

            <div className="flex gap-2 max-w-2xl mx-auto">
              <Input
                placeholder="Что вам нужно? (например, логотип, сайт, SMM)"
                className="bg-white text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="lg" onClick={handleSearch}>
                <Search className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["Дизайн", "Разработка", "Маркетинг", "Тексты", "Видео"].map(
                (tag) => (
                  <Link
                    key={tag}
                    to={`/search?category=${tag}`}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl mb-2">Проверенные специалисты</h3>
                <p className="text-gray-600">
                  Все фрилансеры проходят верификацию. Смотрите портфолио, отзывы
                  и рейтинги перед выбором
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">Безопасные сделки</h3>
                <p className="text-gray-600">
                  Оплата через платформу с гарантией возврата средств. Деньги
                  переводятся исполнителю только после завершения работы
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Удобное общение</h3>
                <p className="text-gray-600">
                  Встроенный мессенджер для быстрой связи с исполнителями. Вся
                  переписка и файлы в одном месте
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Популярные категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Дизайн", icon: "🎨", count: "1,234" },
              { name: "Разработка", icon: "💻", count: "987" },
              { name: "Маркетинг", icon: "📈", count: "756" },
              { name: "Тексты", icon: "✍️", count: "543" },
              { name: "Видео", icon: "🎬", count: "432" },
              { name: "Музыка", icon: "🎵", count: "321" },
              { name: "Переводы", icon: "🌐", count: "298" },
              { name: "Консалтинг", icon: "💼", count: "187" },
            ].map((category) => (
              <Link key={category.name} to={`/search?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.count} специалистов
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Фрилансеров</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-blue-100">Завершенных проектов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-100">Средний рейтинг</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                1
              </div>
              <h3 className="font-semibold mb-2">Опишите задачу</h3>
              <p className="text-gray-600 text-sm">
                Расскажите, что вам нужно, укажите бюджет и сроки
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                2
              </div>
              <h3 className="font-semibold mb-2">Выберите исполнителя</h3>
              <p className="text-gray-600 text-sm">
                Изучите профили, портфолио и отзывы фрилансеров
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                3
              </div>
              <h3 className="font-semibold mb-2">Работайте вместе</h3>
              <p className="text-gray-600 text-sm">
                Обсуждайте детали, отслеживайте прогресс в личном кабинете
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                4
              </div>
              <h3 className="font-semibold mb-2">Получите результат</h3>
              <p className="text-gray-600 text-sm">
                Проверьте работу, оставьте отзыв и оплатите
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-6">Готовы начать?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам довольных клиентов и фрилансеров
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/search">Найти фрилансера</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}