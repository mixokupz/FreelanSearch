// src/app/pages/MyProfilePage.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../api/userService';
import { OwnProfileResponse, UpdateProfileRequest } from '../../types/user';
import {
  UserCircle, Building2, Star, Mail, Phone, MapPin, Edit,
  XCircle, Save
} from 'lucide-react';
import { getFriendlyErrorMessage } from '../../api/errorUtils';

// Безопасная функция форматирования рейтинга
function formatRating(rating: number | null | undefined) {
  if (rating === null || rating === undefined || rating === 0) {
    return 'Новый';
  }
  return typeof rating === 'number' ? rating.toFixed(1) : 'Новый';
}

export function MyProfilePage() {
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<OwnProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFreelancer, setIsFreelancer] = useState(true);

  // Стейты для редактирования (переведены на camelCase)
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    displayName: '',
    bio: '',
    city: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getMe();
        setProfile(response.data);

      
        setFormData({
          displayName: response.data.displayName || '',
          bio: response.data.bio || '',
          city: response.data.city || '',
          avatarUrl: response.data.avatarUrl || ''
        });

        if (response.data.role === 'employer') {
          setIsFreelancer(false);
        }
      } catch (err) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Обработчик сохранения формы
  async function handleSaveChanges(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);

    try {
      const response = await userService.updateMe(formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setActionError(getFriendlyErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  // Сброс формы при отмене изменений
  function handleCancelEdit() {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        city: profile.city || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
    setIsEditing(false);
    setActionError(null);
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Шапка профиля */}
        <div className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-3">Мой профиль</h1>
              <p className="text-muted-foreground">
                Управляйте профилем, откликами и контрактами.
              </p>
            </div>

           
          </div>
        </div>

        {/* Вывод ошибок операций сохранения */}
        {actionError && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Состояние загрузки данных */}
        {loading && <p className="text-muted-foreground text-center py-12">Загружаем данные профиля...</p>}

        {/* Ошибка загрузки */}
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive mb-6">
            Не удалось загрузить профиль: {error}
          </div>
        )}

        {/* Основной контент */}
        {!loading && !error && profile && (
          <>
            {isFreelancer ? (
              /* ================= РЕЖИМ ФРИЛАНСЕРА ================= */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Левая колонка: Карточка */}
                <div className="lg:col-span-1">
                  <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                    <div className="flex flex-col items-center text-center space-y-6">

                      {/* Аватар */}
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-5xl font-semibold text-primary overflow-hidden">
                        {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                        ) : (
                          profile.displayName?.slice(0, 1).toUpperCase() || 'U'
                        )}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">{profile.displayName || 'Имя не указано'}</h2>
                        <p className="text-muted-foreground capitalize">Роль: {profile.role}</p>
                      </div>

                      {/* Рейтинг */}
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-xl">{formatRating(profile.avgRating)}</span>
                        <span className="text-muted-foreground text-sm">
                          ({profile.reviewsCount ?? 0} отв.)
                        </span>
                      </div>

                      {/* Контакты и город */}
                      <div className="w-full pt-6 border-t border-border space-y-4 text-left">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{profile.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{profile.phone}</span>
                          </div>
                        )}
                        {profile.city && !isEditing && (
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{profile.city}</span>
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать профиль
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Правая колонка: Форма ввода ИЛИ текстовое отображение */}
                <div className="lg:col-span-2">
                  {isEditing ? (
                    /* ================= ФОРМА РЕДАКТИРОВАНИЯ ================= */
                    <form onSubmit={handleSaveChanges} className="bg-card border border-border rounded-2xl p-6 space-y-5">
                      <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">Редактирование профиля</h3>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Отображаемое имя</label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          placeholder="Ваше имя или псевдоним"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Ссылка на аватар (URL)</label>
                        <input
                          type="url"
                          maxLength={500}
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Город</label>
                        <input
                          type="text"
                          maxLength={100}
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Москва"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">О себе (Bio)</label>
                        <textarea
                          rows={5}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Расскажите о своем опыте работы и проектах..."
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                        >
                          <Save className="w-5 h-5" />
                          {actionLoading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleCancelEdit}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-muted border border-border text-foreground rounded-xl hover:bg-border transition-all disabled:opacity-70 font-medium"
                        >
                          Отмена
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ================= ОБЫЧНЫЙ ПРОСМОТР ПРОФИЛЯ ================= */
                    <div className="space-y-6">
                      {/* О себе */}
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-4">О себе</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {profile.bio || 'Информация "О себе" пока не заполнена.'}
                        </p>
                      </div>

                      {/* Заглушка навыков */}
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Навыки</h3>
                        <p className="text-sm text-muted-foreground italic">Данные о навыках не найдены в текущем профиле.</p>
                      </div>

                      {/* Заглушка для откликов */}
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Мои услуги</h3>
                        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                          Активные услуги не найдены.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ================= РЕЖИМ ЗАКАЗЧИКА ================= */
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Мои проекты (Заказчик)</h3>
                
                {/* Заглушка для проектов работодателя */}
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">Проекты не найдены</p>
                  <p className="text-sm">Вы еще не создали ни одного проекта или эндпоинт проектов изменен.</p>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}