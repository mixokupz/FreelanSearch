import { Link, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Star, MapPin, Filter } from "lucide-react";
import { mockUsers, mockServices } from "../data/mockData";
import { useEffect, useMemo, useState } from "react";
import type { CatalogFreelancer } from "../types";

type ApiUserProfileResponse = {
  id: number;
  email: string | null;
  phone: string | null;
  role: string;
  is_blocked: boolean;
  created_at: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  avg_rating: number;
  reviews_count: number;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

function mapApiUserToCatalogFreelancer(user: ApiUserProfileResponse): CatalogFreelancer {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    role: user.role,
    bio: user.bio ?? "",
    location: user.city ?? "Город не указан",
    rating: user.avg_rating ?? 0,
    reviewCount: user.reviews_count ?? 0,
    joinedDate: user.created_at,
    avatarUrl: user.avatar_url ?? undefined,
    isBlocked: user.is_blocked,
    skills: user.tags?.map((tag) => tag.name) ?? [],
    tags: user.tags ?? [],
  };
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [freelancers, setFreelancers] = useState<CatalogFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const params = new URLSearchParams({
          page: "1",
          limit: "20",
        });

        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const response = await fetch(`${API_URL}/api/v1/users?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить список пользователей");
        }

        const json = await response.json();
        const items = (json.data?.items ?? []) as ApiUserProfileResponse[];
        setFreelancers(items.map(mapApiUserToCatalogFreelancer));
      } catch (error) {
        console.warn("Фоллбэк каталога: сервер недоступен, используем моки", error);
        setErrorMessage("Каталог загружен из локальных моков");
        setFreelancers(
          mockUsers
            .filter((user) => user.role === "freelancer")
            .map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              bio: user.bio,
              location: user.location,
              rating: user.rating,
              reviewCount: user.reviewCount,
              joinedDate: user.joinedDate,
              skills: user.skills,
            }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const filteredFreelancers = useMemo(() => {
    let filtered = [...freelancers];

    // Фильтр по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Фильтр по категории
    if (category) {
      filtered = filtered.filter((f) =>
        f.skills?.some((s) => s.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Фильтр по цене
    if (priceRange !== "all") {
      filtered = filtered.filter((f) => {
        if (!f.hourlyRate) return false;
        if (priceRange === "low") return f.hourlyRate < 2000;
        if (priceRange === "medium") return f.hourlyRate >= 2000 && f.hourlyRate < 3000;
        if (priceRange === "high") return f.hourlyRate >= 3000;
        return true;
      });
    }

    // Сортировка
    if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    }

    return filtered;
  }, [freelancers, searchQuery, category, priceRange, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Поиск фрилансеров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="button">
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {errorMessage && (
              <p className="text-sm text-amber-600">{errorMessage}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-64 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Фильтры
                  </h3>

                  <div className="space-y-4">
                    <div>
                      {/* <label className="text-sm font-medium mb-2 block">
                        Цена за час
                      </label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Любая</SelectItem>
                          <SelectItem value="low">До 2000 ₽</SelectItem>
                          <SelectItem value="medium">2000 - 3000 ₽</SelectItem>
                          <SelectItem value="high">От 3000 ₽</SelectItem>
                        </SelectContent>
                      </Select> */}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Сортировка
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popularity">По популярности</SelectItem>
                          <SelectItem value="rating">По рейтингу</SelectItem>
                          {/* <SelectItem value="price-low">
                            Цена: по возрастанию
                          </SelectItem>
                          <SelectItem value="price-high">
                            Цена: по убыванию
                          </SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full">
                      Сбросить фильтры
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-gray-600">
                  {isLoading
                    ? "Загружаем специалистов..."
                    : `Найдено специалистов: ${filteredFreelancers.length}`}
                </p>
              </div>

              {!isLoading && <div className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {freelancer.name[0]}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                            <div>
                              <Link
                                to={`/freelancer/${freelancer.id}`}
                                state={{ freelancer }}
                                className="text-xl font-semibold hover:text-blue-600"
                              >
                                {freelancer.name}
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4" />
                                {freelancer.location || "Город не указан"}
                              </div>
                            </div>

                           
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{freelancer.rating || 0}</span>
                              <span className="text-gray-600 text-sm">
                                ({freelancer.reviewCount || 0} отзывов)
                              </span>
                            </div>
                           
                          </div>

                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {freelancer.bio || "Пользователь пока не добавил описание"}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {freelancer.skills?.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button asChild>
                              <Link
                                to={`/freelancer/${freelancer.id}`}
                                state={{ freelancer }}
                              >
                                Посмотреть профиль
                              </Link>
                            </Button>
                            
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>}

              {!isLoading && filteredFreelancers.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-gray-600 mb-4">
                      По вашему запросу ничего не найдено
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setCategory("");
                      setPriceRange("all");
                    }}>
                      Сбросить фильтры
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isLoading && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-gray-600">Загружаем каталог специалистов...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
