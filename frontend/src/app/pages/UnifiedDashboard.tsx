import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Briefcase,
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  ShoppingBag,
  Sparkles,
  Zap,
  LocateFixed,
  LocateIcon,
  LocateOff,
  LocateOffIcon,
  MailCheck,
  MailIcon,
  MapPin,
  Calendar,
} from "lucide-react";
import { getCurrentUser, mockDeals, mockMessages, getUserById, getServicesByFreelancer, getReviewsByFreelancer, mockUsers } from "../data/mockData";
import { useState } from "react";

type DashboardMode = "client" | "freelancer";

export function UnifiedDashboard() {
  const [mode, setMode] = useState<DashboardMode>("client");
  const currentUser = getCurrentUser();
  const userDeals = mockDeals.filter((deal) => deal.clientId === currentUser.id);
  const userMessages = mockMessages.filter(
    (msg) => msg.fromId === currentUser.id || msg.toId === currentUser.id
  );

  // Для режима фрилансера используем данные первого фрилансера
  const freelancerData = mockUsers[0];
  const services = getServicesByFreelancer(freelancerData.id);
  const reviews = getReviewsByFreelancer(freelancerData.id);
  const monthlyEarnings = 125000;
  const activeProjects = 3;
  const completedThisMonth = 8;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className={`flex-1 transition-colors duration-300 ${mode === "client" ? "bg-blue-50" : "bg-purple-50"}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-white shadow-md p-1">
              <button
                onClick={() => setMode("client")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${mode === "client"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-semibold">Режим заказчика</span>
              </button>
              <button
                onClick={() => setMode("freelancer")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${mode === "freelancer"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Режим фрилансера</span>
              </button>
            </div>
          </div>

          {/* CLIENT MODE */}
          {mode === "client" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-blue-900">
                    Добро пожаловать, {currentUser.name}!
                  </h1>
                  <p className="text-blue-700">Найдите идеального исполнителя для вашей задачи</p>
                </div>

              </div>

              {/* Stats Cards
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-blue-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Активных проектов</p>
                        <p className="text-3xl font-bold text-blue-900">
                          {userDeals.filter((d) => d.status === "in-progress").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Завершено</p>
                        <p className="text-3xl font-bold text-green-900">
                          {userDeals.filter((d) => d.status === "completed").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Новых сообщений</p>
                        <p className="text-3xl font-bold text-indigo-900">
                          {userMessages.filter((m) => !m.read && m.toId === currentUser.id).length}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Ожидают оплаты</p>
                        <p className="text-3xl font-bold text-orange-900">
                          {userDeals.filter((d) => d.status === "pending").length}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}

              {/* Main Content */}
              <Tabs defaultValue="projects" className="mb-6">
                <TabsList className="bg-white border-blue-200">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Мои заказы
                  </TabsTrigger>
                  {/* <TabsTrigger value="messages" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Сообщения
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Избранное
                  </TabsTrigger> */}
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                  {userDeals.map((deal) => {
                    const freelancer = getUserById(deal.freelancerId);
                    return (
                      <Card key={deal.id} className="border-blue-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {freelancer?.name[0]}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg mb-1 text-blue-900">
                                  Проект с {freelancer?.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  Начат{" "}
                                  {new Date(deal.createdAt).toLocaleDateString("ru-RU")}
                                </p>
                                <p className="text-gray-600 text-sm mb-2">
                                  Заказчик {freelancer?.name}
                                  
                                </p>
                                <Badge
                                  variant={
                                    deal.status === "completed"
                                      ? "default"
                                      : deal.status === "in-progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={deal.status === "completed" ? "bg-green-600" : deal.status === "in-progress" ? "bg-blue-600" : ""}
                                >
                                  {deal.status === "completed"
                                    ? "Завершен"
                                    : deal.status === "in-progress"
                                      ? "В работе"
                                      : "Ожидает"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-2xl font-bold text-blue-900">
                                {deal.amount.toLocaleString()} ₽
                              </div>
                              <div className="flex gap-2">

                                {deal.status === "completed" && (
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Оставить отзыв</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {userDeals.length === 0 && (
                    <Card className="border-blue-200 bg-white">
                      <CardContent className="pt-6 text-center py-12">
                        <Briefcase className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-blue-900">
                          У вас пока нет проектов
                        </h3>
                        <p className="text-blue-700 mb-4">
                          Найдите исполнителя для вашей задачи
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link to="/search">Найти фрилансера</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  {userMessages.slice(0, 5).map((message) => {
                    const isFromMe = message.fromId === currentUser.id;
                    const otherPerson = isFromMe ? message.toName : message.fromName;
                    return (
                      <Card key={message.id} className="border-blue-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {otherPerson[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-blue-900">{otherPerson}</h3>
                                <span className="text-sm text-gray-600">
                                  {new Date(message.timestamp).toLocaleTimeString(
                                    "ru-RU",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <p className="text-gray-700 line-clamp-2">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50" asChild>
                    <Link to="/messages">Все сообщения</Link>
                  </Button>
                </TabsContent>

                <TabsContent value="favorites">
                  <Card className="border-blue-200 bg-white">
                    <CardContent className="pt-6 text-center py-12">
                      <Star className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-blue-900">
                        Список избранного пуст
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Добавляйте понравившихся исполнителей в избранное
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to="/search">Найти фрилансера</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* FREELANCER MODE */}
          {mode === "freelancer" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-purple-900">
                    Добро пожаловать, {currentUser.name}!
                  </h1>
                  <p className="text-purple-700">Развивайте свой бизнес и находите новых клиентов</p>
                </div>
              </div>

              {/* Profile Card */}
              <Card className="mb-6 border-purple-200 bg-white">
                <CardHeader className="border-b border-purple-100">
                  <CardTitle className="flex items-center justify-between text-purple-900">
                    <span>Мой профиль</span>
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50" asChild>
                      <Link to={`/freelancer/${freelancerData.id}`}>
                        Посмотреть публичный профиль
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                      {freelancerData.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-purple-900">
                        {freelancerData.name}
                      </h3>
                      <p className="text-gray-700 mb-3">{freelancerData.bio}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div>
                          <Star className="w-4 h-4 inline mr-1 fill-amber-400 text-amber-400" />
                          {freelancerData.rating} ({freelancerData.reviewCount}{" "}
                          отзывов)
                        </div>
                        <div>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          зарегистрирован {freelancerData.joinedDate}
                        </div>
                        <div>
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {freelancerData.location}
                        </div>
                        <div>
                          <MailIcon className="w-4 h-4 inline mr-1" />
                          {freelancerData.email}
                        </div>
                      </div>
                    </div>
                    {/* <Button className="bg-purple-600 hover:bg-purple-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </Button> */}
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <Tabs defaultValue="services" className="mb-6">
                <TabsList className="bg-white border-purple-200">
                  <TabsTrigger value="services" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Мои услуги
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Заказы
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Отзывы
                  </TabsTrigger>
                  {/* <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Аналитика
                  </TabsTrigger> */}
                </TabsList>

                <TabsContent value="services" className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 text-purple-900">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {service.tags?.map((tag) => (
                                <Badge key={tag} variant="outline" className="border-purple-300 text-purple-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-semibold text-purple-900">
                                  {service.price.toLocaleString()} ₽
                                </span>
                              </div>
                              <div>Срок: {service.deliveryTime} дней</div>

                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50" asChild>
                              <Link to={`/service/edit/${service.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Редактировать
                              </Link>
                            </Button>

                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50" asChild>
                    <Link to="/service/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить новую услугу
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <Card className="border-purple-200 bg-white">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        {[
                          {
                            id: 1,
                            client: "Ольга Соколова",
                            service: "Разработка логотипа",
                            status: "in-progress",
                            deadline: "2026-03-10",
                            amount: 15000,
                          },
                          {
                            id: 2,
                            client: "Игорь Белов",
                            service: "UI/UX дизайн",
                            status: "pending",
                            deadline: "2026-03-15",
                            amount: 45000,
                          },
                        ].map((order) => (
                          <div
                            key={order.id}
                            className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                {order.client[0]}
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-900">{order.service}</h4>
                                <p className="text-sm text-gray-600">
                                  Клиент: {order.client}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Дедлайн: {new Date(order.deadline).toLocaleDateString("ru-RU")}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={order.status === "in-progress" ? "bg-purple-600" : "bg-pink-600"}
                              >
                                {order.status === "in-progress" ? "В работе" : "Новый"}
                              </Badge>
                              <div className="font-bold text-purple-900">
                                {order.amount.toLocaleString()} ₽
                              </div>
                              {/* <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Открыть</Button> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-purple-200 bg-white">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {review.clientName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-purple-900">{review.clientName}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(review.date).toLocaleDateString("ru-RU")}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="analytics">
                  <Card className="border-purple-200 bg-white">
                    <CardHeader>
                      <CardTitle className="text-purple-900">Статистика за месяц</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-3xl font-bold text-purple-600">256</div>
                          <div className="text-sm text-purple-800">Просмотров профиля</div>
                        </div>
                        <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                          <div className="text-3xl font-bold text-pink-600">42</div>
                          <div className="text-sm text-pink-800">Новых запросов</div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="text-3xl font-bold text-indigo-600">18</div>
                          <div className="text-sm text-indigo-800">Заказов</div>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="text-3xl font-bold text-amber-600">95%</div>
                          <div className="text-sm text-amber-800">Процент завершения</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>


    </div>
  );
}
