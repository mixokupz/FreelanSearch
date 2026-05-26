// src/app/pages/FreelancersPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../api/userService';
import { PublicProfileResponse } from '../../types/user';
import { ArrowRight, Star, MapPin, UserCheck } from 'lucide-react';

// Безопасная функция форматирования рейтинга
function formatRating(rating: number | null | undefined) {
  if (rating === null || rating === undefined || rating === 0) {
    return 'Новый';
  }
  return typeof rating === 'number' ? rating.toFixed(1) : 'Новый';
}

export function FreelancersPage() {
  const { user: currentUser } = useAuth(); // Берем текущего юзера из контекста для фильтрации

  const [freelancers, setFreelancers] = useState<PublicProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers();
        
        // Массив всех пользователей с бэкенда
        let list = response.data;

        // Фильтруем список: убираем текущего пользователя, чтобы не видеть самого себя
        if (currentUser?.userId) {
          list = list.filter((item: PublicProfileResponse) => item.id !== Number(currentUser.userId));
        }

        setFreelancers(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить список специалистов');
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [currentUser]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Заголовок страницы */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Список фрилансеров</h1>
          <p className="text-muted-foreground">
            Найдите специалиста для своего проекта.
          </p>
        </div>

        {/* Индикатор загрузки */}
        {loading && <p className="text-muted-foreground text-center py-12">Загружаем список специалистов...</p>}

        {/* Ошибка запроса */}
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось получить фрилансеров: {error}
          </div>
        )}

        {/* Пустой результат */}
        {!loading && !error && freelancers.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground text-center">
            В базе пока нет других специалистов.
          </div>
        )}

        {/* Список карточек */}
        <div className="space-y-4">
          {!loading && freelancers.map((freelancer) => (
            <Link
              key={freelancer.id}
              to={`/freelancer/${freelancer.id}`}
              className="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg group"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                
                {/* Аватарка или первая буква */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-2xl font-semibold text-primary overflow-hidden">
                  {freelancer.avatarUrl ? (
                    <img src={freelancer.avatarUrl} alt={freelancer.displayName} className="w-full h-full object-cover" />
                  ) : (
                    freelancer.displayName?.slice(0, 1).toUpperCase() || 'F'
                  )}
                </div>

                {/* Основной блок контента карточки */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary flex items-center gap-2">
                        {freelancer.displayName || 'Специалист'}
                        <span className="text-xs font-normal px-2 py-0.5 bg-muted text-muted-foreground rounded-md capitalize">
                          {freelancer.role}
                        </span>
                      </h3>
                      {/* Показываем bio (описание) фрилансера */}
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {freelancer.bio || 'Описание профиля не заполнено.'}
                      </p>
                    </div>

                    {/* Рейтинг */}
                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm self-start">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{formatRating(freelancer.avgRating)}</span>
                      <span className="text-muted-foreground text-xs">
                        ({freelancer.reviewsCount ?? 0} отв.)
                      </span>
                    </div>
                  </div>

                  {/* Геолокация */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {freelancer.city ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        <MapPin className="w-3.5 h-3.5" />
                        {freelancer.city}
                      </span>
                    ) : (
                      <span className="rounded-lg bg-muted/50 border border-border px-3 py-1 text-xs text-muted-foreground italic">
                        Город не указан
                      </span>
                    )}
                  </div>

                  {/* Подвал карточки */}
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2 text-xs">
                      <UserCheck className="h-4 w-4 text-secondary" />
                      <span>Спецификация: Публичный профиль</span>
                    </div>
                    
                    {/* Кнопка действия */}
                    <div className="md:ml-auto flex items-center gap-2 text-primary group-hover:text-secondary transition-colors">
                      <span className="font-medium text-sm">Открыть профиль</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}