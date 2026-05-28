// src/app/pages/FreelancerProfilePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Briefcase, Mail, Phone, Star, MapPin } from 'lucide-react';
import { userService } from '../../api/userService';
import { listingService } from '../../api/listingService';
import { PublicProfileResponse } from '../../types/user';
import { ListingDetailsResponse } from '../../types/listing';
import { getFriendlyErrorMessage } from '../../api/errorUtils';

function formatRating(rating: number | null) {
  return rating === null || rating === 0 ? 'Новый' : rating.toFixed(1);
}

export function FreelancerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);

  // Стейты для загрузки публичного профиля
  const [freelancer, setFreelancer] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Стейты для загрузки услуг специалиста
  const [listings, setListings] = useState<ListingDetailsResponse[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(userId)) return;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getPublicProfile(userId);
        setFreelancer(response.data);
      } catch (err) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  // Загрузка услуг специалиста
  useEffect(() => {
    if (!Number.isFinite(userId)) return;

    const fetchListings = async () => {
      try {
        setListingsLoading(true);
        const response = await listingService.getListingsByUser(userId);
        setListings(response.data);
      } catch (err) {
        setListingsError(getFriendlyErrorMessage(err));
      } finally {
        setListingsLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  // Валидация ID в параметрах урла
  if (!Number.isFinite(userId)) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Некорректный ID пользователя</h1>
          <button
            onClick={() => navigate('/freelancers')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка Назад */}
        <button
          onClick={() => navigate('/freelancers')}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Назад к списку фрилансеров</span>
        </button>

        {loading && <p className="text-muted-foreground text-center py-12">Загружаем профиль специалиста...</p>}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось загрузить профиль: {error}
          </div>
        )}

        {!loading && !error && !freelancer && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground text-center">
            Специалист не найден в системе.
          </div>
        )}

        {/* Основной контент публичного профиля */}
        {!loading && !error && freelancer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Левая колонка: Краткая карточка */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                <div className="flex flex-col items-center text-center space-y-6">
                  
                  {/* Аватар */}
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-5xl font-semibold text-primary overflow-hidden">
                    {freelancer.avatarUrl ? (
                      <img src={freelancer.avatarUrl} alt={freelancer.displayName} className="w-full h-full object-cover" />
                    ) : (
                      freelancer.displayName?.slice(0, 1).toUpperCase() || 'F'
                    )}
                  </div>

                  {/* Имя и роль */}
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      {freelancer.displayName || 'Специалист'}
                    </h2>
                    <p className="text-sm text-muted-foreground capitalize">Роль: {freelancer.role}</p>
                  </div>

                  {/* Рейтинг */}
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xl">{formatRating(freelancer.avgRating)}</span>
                    <span className="text-muted-foreground text-sm">
                      ({freelancer.reviewsCount} отв.)
                    </span>
                  </div>

                  {/* Город (если указан) */}
                  {freelancer.city && (
                    <div className="w-full pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{freelancer.city}</span>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Правая колонка: Детальная информация и заглушки */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* О специалисте */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">О специалисте</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {freelancer.bio || 'Специалист предпочитает не рассказывать о себе.'}
                </p>
              </div>

              {/* Контакты */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Контакты</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-sm">{freelancer.email || 'Email не указан'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-sm">{freelancer.phone || 'Телефон не указан'}</span>
                  </div>
                </div>
              </div>

              {/* Заглушка навыков */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Навыки</h3>
                <p className="text-sm text-muted-foreground italic">
                  Список ключевых навыков не указан в публичном профиле.
                </p>
              </div>

              {/* Список услуг */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Услуги</h3>
                
                {listingsLoading && <p className="text-sm text-muted-foreground text-center py-4">Загрузка услуг...</p>}
                
                {!listingsLoading && listingsError && (
                  <div className="text-sm text-destructive p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    {listingsError}
                  </div>
                )}

                {!listingsLoading && !listingsError && listings.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                    Услуги не найдены.
                  </div>
                )}

                {!listingsLoading && listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-all mb-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{listing.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-primary">{listing.price} ₽</span>
                        <span className="text-[10px] text-muted-foreground capitalize">({listing.priceType})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}