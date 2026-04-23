import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { mockUsers, mockServices, mockReviews } from "../data/mockData";
import { useState } from "react";

export function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const pendingContent = [
    {
      id: "1",
      type: "service",
      title: "Настройка контекстной рекламы",
      author: "Иван Петров",
      status: "pending",
      date: "2026-03-02",
    },
    {
      id: "2",
      type: "review",
      title: "Отзыв от Марии К.",
      author: "Мария Кузнецова",
      status: "pending",
      date: "2026-03-02",
    },
  ];

  const reportedContent = [
    {
      id: "1",
      type: "user",
      title: "Жалоба на пользователя",
      content: "Нарушение правил платформы",
      reporter: "Анонимный пользователь",
      date: "2026-03-01",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
              <p className="text-gray-600">Управление платформой и модерация</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Shield className="w-5 h-5 mr-2" />
              Администратор
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Всего пользователей</p>
                    <p className="text-3xl font-bold">{mockUsers.length}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Активных услуг</p>
                    <p className="text-3xl font-bold">{mockServices.length}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">На модерации</p>
                    <p className="text-3xl font-bold">{pendingContent.length}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Жалоб</p>
                    <p className="text-3xl font-bold">{reportedContent.length}</p>
                  </div>
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="moderation" className="mb-6">
            <TabsList>
              <TabsTrigger value="moderation">Модерация</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="reports">Жалобы</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="moderation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Контент, ожидающий модерации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingContent.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              {item.type === "service" ? "Услуга" : "Отзыв"}
                            </Badge>
                            <h4 className="font-semibold">{item.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            Автор: {item.author}
                          </p>
                          <p className="text-sm text-gray-600">
                            Дата:{" "}
                            {new Date(item.date).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Просмотреть
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Одобрить
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Отклонить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <CardTitle>Управление пользователями</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Поиск..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все</SelectItem>
                          <SelectItem value="client">Клиенты</SelectItem>
                          <SelectItem value="freelancer">Фрилансеры</SelectItem>
                          <SelectItem value="admin">Администраторы</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockUsers.slice(0, 10).map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user.name[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary">{user.role}</Badge>
                              {user.rating && (
                                <Badge variant="outline">⭐ {user.rating}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Просмотреть
                          </Button>
                          <Button size="sm" variant="outline">
                            Редактировать
                          </Button>
                          <Button size="sm" variant="destructive">
                            Заблокировать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Жалобы и обращения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportedContent.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border rounded-lg border-red-200 bg-red-50"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {report.title}
                            </h4>
                            <p className="text-sm text-gray-700 mb-2">
                              {report.content}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>От: {report.reporter}</span>
                              <span>
                                {new Date(report.date).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Расследовать</Button>
                          <Button size="sm" variant="outline">
                            Отклонить
                          </Button>
                          <Button size="sm" variant="destructive">
                            Принять меры
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки платформы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Общие настройки
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Регистрация новых пользователей</p>
                            <p className="text-sm text-gray-600">
                              Разрешить новым пользователям регистрироваться
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Включено
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Автоматическая модерация</p>
                            <p className="text-sm text-gray-600">
                              Использовать AI для предварительной проверки контента
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Выключено
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-2">Комиссии</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p>Комиссия платформы</p>
                          <Input
                            type="number"
                            defaultValue="15"
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
