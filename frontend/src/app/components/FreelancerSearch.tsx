// src/app/components/FreelancerSearch.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Star, MapPin } from 'lucide-react';
import { userService } from '../../api/userService';
import { useAuth } from '../../context/AuthContext';
import { PublicProfileResponse } from '../../types/user';

const categories = [
  { value: 'all', label: 'Все специалисты' },
  { value: 'freelancer', label: 'Фрилансеры' },
  { value: 'employer', label: 'Заказчики' },
];

// Безопасная функция форматирования рейтинга
function formatRating(rating: number | null | undefined) {
  if (rating === null || rating === undefined || rating === 0) {
    return 'Новый';
  }
  return typeof rating === 'number' ? rating.toFixed(1) : 'Новый';
}

export function FreelancerSearch() {
  const { user: currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Стейты для бэкенда
  const [freelancers, setFreelancers] = useState<PublicProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем пользователей
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers();
        
        let list = response.data;
        
        // Фильтруем текущего пользователя из выдачи
        if (currentUser?.userId) {
          list = list.filter((item: PublicProfileResponse) => item.id !== Number(currentUser.userId));
        }
        
        setFreelancers(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUser]);

  // Фильтрация на клиенте (Поиск + Категория/Роль)
  const filteredFreelancers = useMemo(() => {
    return freelancers.filter((freelancer: PublicProfileResponse) => {
      // Защита от null-значений через оператор ??
      const searchTarget = [
        freelancer.displayName ?? '',
        freelancer.bio ?? '',
        freelancer.city ?? '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' || searchTarget.includes(searchQuery.trim().toLowerCase());

      const matchesSelectedCategory =
        selectedCategory === 'all' || freelancer.role === selectedCategory;

      return matchesSearch && matchesSelectedCategory;
    });
  }, [freelancers, searchQuery, selectedCategory]);

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-primary mb-6">
            Найдите идеального специалиста
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Подберите исполнителя по ключевым словам, городу и роли в системе.
          </p>
        </div>

        {/* Панель фильтров */}
        <div className="mb-12 rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по имени, описанию или городу..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-border bg-muted px-6 py-4 pl-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Роль в системе</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all capitalize"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="rounded-lg bg-secondary/10 px-4 py-3 text-secondary w-full text-center md:text-left">
                Найдено совпадений: <span className="font-semibold">{filteredFreelancers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {loading && <p className="text-muted-foreground text-center py-6">Загружаем профили...</p>}
        {error && <p className="text-destructive text-center py-6">Ошибка загрузки: {error}</p>}

        {/* Сетка результатов поиска */}
        <div className="grid gap-6">
          {!loading && filteredFreelancers.map((freelancer: PublicProfileResponse) => (
            <Link
              key={freelancer.id}
              to={`/freelancer/${freelancer.id}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                
                {/* Аватар */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-5xl font-semibold text-primary shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
                  {freelancer.avatarUrl ? (
                    <img src={freelancer.avatarUrl} alt={freelancer.displayName} className="w-full h-full object-cover" />
                  ) : (
                    freelancer.displayName?.slice(0, 1).toUpperCase() || 'F'
                  )}
                </div>

                {/* Текстовая информация */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-primary group-hover:text-secondary transition-colors flex items-center gap-2">
                        {freelancer.displayName || 'Специалист'}
                        <span className="text-xs font-normal px-2 py-0.5 bg-muted text-muted-foreground rounded-md capitalize">
                          {freelancer.role}
                        </span>
                      </h3>
                    </div>

                    {/* Рейтинг */}
                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{formatRating(freelancer.avgRating)}</span>
                      <span className="text-muted-foreground text-xs">
                        ({freelancer.reviewsCount ?? 0} отв.)
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {freelancer.bio || 'Пользователь не добавил описание своего профиля.'}
                  </p>

                  {/* Город и кнопка перехода */}
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between border-t border-border/50 pt-4">
                    <div className="flex items-center gap-4">
                      {freelancer.city ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{freelancer.city}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Город не указан</span>
                      )}
                    </div>
                    <div className="font-medium text-primary text-sm group-hover:translate-x-1 transition-transform">
                      Открыть профиль →
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}