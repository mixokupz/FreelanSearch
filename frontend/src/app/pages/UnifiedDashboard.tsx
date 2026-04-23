import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Briefcase,
  Star,
  Plus,
  Edit,
  ShoppingBag,
  Sparkles,
  MapPin,
  Calendar,
  MailIcon,
} from "lucide-react";
import { 
  getCurrentUser, 
  mockDeals, 
  mockMessages, 
  getUserById, 
  getServicesByFreelancer, 
  getReviewsByFreelancer, 
  mockUsers 
} from "../data/mockData";
import { useState, useEffect } from "react";
import { toast } from "sonner"; // Если используешь sonner для уведомлений

type DashboardMode = "client" | "freelancer";

export function UnifiedDashboard() {
  const [mode, setMode] = useState<DashboardMode>("client");
  
  // 1. Создаем состояния для наших данных
  const [userData, setUserData] = useState<any>(null);
  const [userDeals, setUserDeals] = useState<any[]>([]);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);


  // 2. Функция загрузки данных с фоллбэком на моки
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL ;
      const token = localStorage.getItem("token"); // Берем токен, сохраненный при логине

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      };

      // Профиль пользователя (/api/v1/users/me)
      try {
        const res = await fetch(`${API_URL}/api/v1/users/me`, { headers });
        if (!res.ok) throw new Error("API User Error");
        const json = await res.json();
        setUserData(json.data);
      } catch (err) {
        console.warn("Фоллбэк профиля: сервер недоступен, используем моки");
        setUserData(getCurrentUser());
      }

      // Сделки пользователя (/api/v1/users/me/deals)
      try {
        const res = await fetch(`${API_URL}/api/v1/users/me/deals`, { headers });
        if (!res.ok) throw new Error("API Deals Error");
        const json = await res.json();
        setUserDeals(json.data.items);
      } catch (err) {
        console.warn("Фоллбэк сделок: сервер недоступен, используем моки");
        const mockUser = getCurrentUser();
        setUserDeals(mockDeals.filter((deal) => deal.clientId === mockUser.id));
      }

      // Услуги пользователя (/api/v1/users/me/services)
      try {
        const res = await fetch(`${API_URL}/api/v1/users/me/services`, { headers });
        if (!res.ok) throw new Error("API Services Error");
        const json = await res.json();
        setUserServices(json.data.items);
      } catch (err) {
        console.warn("Фоллбэк услуг: сервер недоступен, используем моки");
        setUserServices(getServicesByFreelancer(mockUsers[0].id));
      }

      // Отзывы о пользователе (/api/v1/users/me/reviews?role=freelancer)
      try {
        // Добавляем параметр ?role=freelancer (согласно твоей OpenAPI доке)
        const res = await fetch(`${API_URL}/api/v1/users/me/reviews?role=freelancer`, { headers });
        if (!res.ok) throw new Error("API Reviews Error");
        const json = await res.json();
        setUserReviews(json.data.items);
      } catch (err) {
        console.warn("Фоллбэк отзывов: сервер недоступен, используем моки");
        setUserReviews(getReviewsByFreelancer(mockUsers[0].id));
      }

   

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Если данные еще грузятся, показываем скелетон или текст загрузки
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-blue-600 animate-pulse">Загрузка данных дашборда...</div>
      </div>
    );
  }

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
                    Добро пожаловать, {userData.name}!
                  </h1>
                  <p className="text-blue-700">Найдите идеального исполнителя для вашей задачи</p>
                </div>
              </div>

              <Tabs defaultValue="projects" className="mb-6">
                <TabsList className="bg-white border-blue-200">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Мои заказы
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                  {userDeals.map((deal) => {
                    // Учитываем разницу полей: API возвращает executor.display_name, а моки freelancerId
                    const freelancerName = deal.executor?.display_name || getUserById(deal.freelancerId)?.name || "Неизвестно";
                    
                    return (
                      <Card key={deal.id} className="border-blue-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {freelancerName[0]}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg mb-1 text-blue-900">
                                  {deal.service?.title || `Проект с ${freelancerName}`}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  Начат {new Date(deal.created_at || deal.createdAt).toLocaleDateString("ru-RU")}
                                </p>
                                <Badge
                                  variant={deal.status === "completed" ? "default" : deal.status === "in_progress" || deal.status === "in-progress" ? "secondary" : "outline"}
                                  className={deal.status === "completed" ? "bg-green-600" : "bg-blue-600"}
                                >
                                  {deal.status === "completed" ? "Завершен" : "В работе"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-2xl font-bold text-blue-900">
                                {/* Учитываем разницу полей API (payment) и Моков (amount) */}
                                {(deal.payment || deal.amount || 0).toLocaleString()} ₽
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
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link to="/search">Найти фрилансера</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
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
                    Добро пожаловать, {userData.name}!
                  </h1>
                  <p className="text-purple-700">Развивайте свой бизнес и находите новых клиентов</p>
                </div>
              </div>

              {/* Profile Card */}
              <Card className="mb-6 border-purple-200 bg-white">
                <CardHeader className="border-b border-purple-100">
                  <CardTitle className="flex items-center justify-between text-purple-900">
                    <span>Мой профиль</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                      {userData.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-purple-900">
                        {userData.name}
                      </h3>
                      <p className="text-gray-700 mb-3">{userData.bio || "Описание профиля не заполнено"}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div>
                          <Star className="w-4 h-4 inline mr-1 fill-amber-400 text-amber-400" />
                          {userData.avg_rating || userData.rating || 0} ({userData.reviews_count || userData.reviewCount || 0} отзывов)
                        </div>
                        {userData.city && (
                          <div>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {userData.city || userData.location}
                          </div>
                        )}
                        {userData.email && (
                          <div>
                            <MailIcon className="w-4 h-4 inline mr-1" />
                            {userData.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <Tabs defaultValue="services" className="mb-6">
                <TabsList className="bg-white border-purple-200">
                  <TabsTrigger value="services" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Мои услуги
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    Отзывы
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-4">
                  {userServices.map((service) => (
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
                            <div className="flex gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-semibold text-purple-900">
                                  {service.price ? `${service.price.toLocaleString()} ₽` : "Договорная"}
                                </span>
                              </div>
                              {/* Обработка данных API (execution_period_days) и Моков (deliveryTime) */}
                              <div>Срок: {service.execution_period_days || service.deliveryTime} дней</div>
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
                      <Plus className="w-4 h-4 mr-2" /> Добавить новую услугу
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {userReviews.map((review) => {
                    const authorName = review.author?.display_name || review.clientName || "Аноним";
                    return (
                      <Card key={review.id} className="border-purple-200 bg-white">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {authorName[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-semibold text-purple-900">{authorName}</div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(review.created_at || review.date).toLocaleDateString("ru-RU")}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-5 h-5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
