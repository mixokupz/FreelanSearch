import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  MessageSquare,
  Globe,
  MailIcon,
} from "lucide-react";
import type { CatalogFreelancer } from "../types";
import {
  getUserById,
  getServicesByFreelancer,
  getReviewsByFreelancer,
} from "../data/mockData";

type ProfileService = {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  tags?: string[];
};

type ProfileReview = {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
};

type ApiServiceResponse = {
  id: number;
  title: string;
  description: string;
  execution_period_days: number;
  price: number | null;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

type ApiReviewResponse = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  author?: {
    id: number;
    display_name: string;
    avatar_url: string | null;
  };
};

function mapApiService(service: ApiServiceResponse): ProfileService {
  return {
    id: String(service.id),
    title: service.title,
    description: service.description,
    price: service.price ?? 0,
    deliveryTime: service.execution_period_days,
    tags: service.tags?.map((tag) => tag.name) ?? [],
  };
}

function mapApiReview(review: ApiReviewResponse): ProfileReview {
  return {
    id: String(review.id),
    clientName: review.author?.display_name || "Пользователь",
    rating: review.rating,
    comment: review.comment || "Без комментария",
    date: review.created_at,
  };
}

export function FreelancerProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const freelancerFromState = (location.state as { freelancer?: CatalogFreelancer } | null)?.freelancer;
  const freelancerFromMock = getUserById(id || "");
  const freelancer = freelancerFromState ?? freelancerFromMock;
  const [services, setServices] = useState<ProfileService[]>([]);
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    const userId = id || "";
    if (!userId) {
      setIsLoadingServices(false);
      setIsLoadingReviews(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchServices = async () => {
      setIsLoadingServices(true);

      try {
        const response = await fetch(`${API_URL}/api/v1/users/${userId}/services`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить услуги пользователя");
        }

        const json = await response.json();
        const items = (json.data?.items ?? []) as ApiServiceResponse[];
        setServices(items.map(mapApiService));
      } catch (error) {
        console.warn("Фоллбэк услуг профиля: сервер недоступен, используем моки", error);
        setServices(
          getServicesByFreelancer(userId).map((service) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            price: service.price,
            deliveryTime: service.deliveryTime,
            tags: service.tags,
          }))
        );
      } finally {
        setIsLoadingServices(false);
      }
    };

    const fetchReviews = async () => {
      setIsLoadingReviews(true);

      try {
        const response = await fetch(`${API_URL}/api/v1/users/${userId}/reviews?role=freelancer`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить отзывы пользователя");
        }

        const json = await response.json();
        const items = (json.data?.items ?? []) as ApiReviewResponse[];
        setReviews(items.map(mapApiReview));
      } catch (error) {
        console.warn("Фоллбэк отзывов профиля: сервер недоступен, используем моки", error);
        setReviews(
          getReviewsByFreelancer(userId).map((review) => ({
            id: review.id,
            clientName: review.clientName,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
          }))
        );
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchServices();
    fetchReviews();
  }, [id]);

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Фрилансер не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
                  {freelancer.name[0]}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{freelancer.name}</h1>

                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {freelancer.location || "Город не указан"}
                    </div>
                    {freelancer.joinedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        На платформе с{" "}
                        {new Date(freelancer.joinedDate).toLocaleDateString("ru-RU", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    )}
                    {"languages" in freelancer &&
                      Array.isArray(freelancer.languages) &&
                      freelancer.languages.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {freelancer.languages.join(", ")}
                        </div>
                      )}
                    {freelancer.email && (
                      <div className="flex items-center gap-1">
                        <MailIcon className="w-4 h-4" />
                        {freelancer.email}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-semibold">
                        {freelancer.rating || 0}
                      </span>
                      <span className="text-gray-600">
                        ({freelancer.reviewCount || 0} отзывов)
                      </span>
                    </div>
                    {"completedJobs" in freelancer && typeof freelancer.completedJobs === "number" && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-semibold">
                          {freelancer.completedJobs}
                        </span>
                        <span className="text-gray-600">выполнено</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">
                    {freelancer.bio || "Пользователь пока не добавил описание"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {freelancer.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>


                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="services" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Услуги</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              {/* <TabsTrigger value="portfolio">Портфолио</TabsTrigger> */}
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              {isLoadingServices ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12 text-gray-600">
                    Загружаем услуги...
                  </CardContent>
                </Card>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-48 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-12 h-12 text-purple-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.tags?.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-4">
                            <div className="text-2xl font-bold text-blue-600">
                              {service.price.toLocaleString()} ₽
                            </div>
                            <div className="text-gray-600">
                              Срок: {service.deliveryTime} дней
                            </div>
                            <Button className="ml-auto">Заказать</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-12 text-gray-600">
                    Услуги пока не добавлены
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {isLoadingReviews ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12 text-gray-600">
                    Загружаем отзывы...
                  </CardContent>
                </Card>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {review.clientName[0]}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <div>
                              <div className="font-semibold">
                                {review.clientName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(review.date).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
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
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-12 text-gray-600">
                    Отзывы пока отсутствуют
                  </CardContent>
                </Card>
              )}
            </TabsContent>
{/* 
            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center"
                      >
                        <Award className="w-12 h-12 text-purple-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
