// src/app/pages/MyProfilePage.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../api/userService';
import { listingService } from '../../api/listingService';
import { OwnProfileResponse, UpdateProfileRequest } from '../../types/user';
import { ListingDetailsResponse, CreateListingRequest, UpdateListingRequest } from '../../types/listing';
import {
  UserCircle, Building2, Star, Mail, Phone, MapPin, Edit,
  XCircle, Save, Plus, Trash2, Edit3
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

  // Стейты для редактирования профиля
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    displayName: '',
    bio: '',
    city: '',
    avatarUrl: ''
  });

  // Стейты для управления услугами
  const [listings, setListings] = useState<ListingDetailsResponse[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [listingMode, setListingMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedListing, setSelectedListing] = useState<ListingDetailsResponse | null>(null);
  const [listingForm, setListingForm] = useState<CreateListingRequest>({
    title: '',
    description: '',
    price: 0,
    priceType: 'fixed'
  });
  const [listingActionLoading, setListingActionLoading] = useState(false);
  const [listingActionError, setListingActionError] = useState<string | null>(null);

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

  // Загрузка собственных услуг
  useEffect(() => {
    if (!currentUser) return;

    const fetchMyListings = async () => {
      try {
        setListingsLoading(true);
        const response = await listingService.getListingsByUser(Number(currentUser.userId));
        setListings(response.data);
      } catch (err) {
        setListingsError(getFriendlyErrorMessage(err));
      } finally {
        setListingsLoading(false);
      }
    };

    fetchMyListings();
  }, [currentUser]);

  // Обработчик сохранения профиля
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

  // Сброс формы при отмене изменений профиля
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

  // --- Функции для управления услугами ---

  function openCreateListing() {
    setListingForm({ title: '', description: '', price: 0, priceType: 'fixed' });
    setListingMode('create');
    setListingActionError(null);
  }

  function openEditListing(listing: ListingDetailsResponse) {
    setListingForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      priceType: listing.priceType as 'fixed' | 'hourly' | 'monthly'
    });
    setSelectedListing(listing);
    setListingMode('edit');
    setListingActionError(null);
  }

  async function handleSaveListing(e: React.FormEvent) {
    e.preventDefault();
    setListingActionLoading(true);
    setListingActionError(null);

    try {
      if (listingMode === 'create') {
        const response = await listingService.createListing(listingForm);
        // Оптимистичное добавление новой услуги в список
        setListings(prev => [...prev, response.data]);
      } else {
        // Добавляем текущий статус при обновлении, так как бэкенд его требует
        const response = await listingService.updateListing(selectedListing!.id, {
          ...listingForm,
          status: selectedListing!.status
        });
        // Обновляем конкретную услугу в списке
        setListings(prev => prev.map(item => item.id === response.data.id ? response.data : item));
      }
      
      setListingMode('view');
    } catch (err) {
      setListingActionError(getFriendlyErrorMessage(err));
    } finally {
      setListingActionLoading(false);
    }
  }

  async function handleDeleteListing(id: number) {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;
    
    setListingActionLoading(true);
    setListingActionError(null);
    try {
      await listingService.deleteListing(id);
      const response = await listingService.getListingsByUser(Number(currentUser?.userId));
      setListings(response.data);
    } catch (err) {
      setListingActionError(getFriendlyErrorMessage(err));
    } finally {
      setListingActionLoading(false);
    }
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
                Управляйте своим профилем и списком услуг
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
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y min-h-[120px]"
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

                    {/* Мои услуги */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-foreground">Мои услуги</h3>
                        {listingMode === 'view' && (
                          <button
                            onClick={openCreateListing}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Добавить услугу
                          </button>
                        )}
                      </div>

                      {listingMode !== 'view' ? (
                        /* ФОРМА СОЗДАНИЯ / РЕДАКТИРОВАНИЯ УСЛУГИ */
                        <form onSubmit={handleSaveListing} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Название услуги</label>
                            <input
                              type="text"
                              required
                              value={listingForm.title}
                              onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                              placeholder="Напр: Разработка сайтов на React"
                              className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Описание</label>
                            <textarea
                              required
                              rows={5}
                              value={listingForm.description}
                              onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                              placeholder="Подробно опишите, что вы предлагаете..."
                              className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y min-h-[120px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Цена</label>
                              <input
                                type="number"
                                required
                                min={0}
                                value={listingForm.price}
                                onChange={(e) => setListingForm({ ...listingForm, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Тип цены</label>
                              <select
                                value={listingForm.priceType}
                                onChange={(e) => setListingForm({ ...listingForm, priceType: e.target.value as any })}
                                className="w-full px-4 py-2 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              >
                                <option value="fixed">Фиксированная</option>
                                <option value="hourly">Почасовая</option>
                                <option value="monthly">Месячная</option>
                              </select>
                            </div>
                          </div>

                          {listingActionError && (
                            <div className="text-xs text-destructive flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              {listingActionError}
                            </div>
                          )}

                          <div className="flex gap-3 pt-2">
                            <button
                              type="submit"
                              disabled={listingActionLoading}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-70 font-medium text-sm"
                            >
                              <Save className="w-4 h-4" />
                              {listingActionLoading ? 'Сохранение...' : listingMode === 'create' ? 'Создать' : 'Сохранить'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setListingMode('view')}
                              className="px-4 py-2 bg-muted border border-border text-foreground rounded-lg hover:bg-border transition-all text-sm font-medium"
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* СПИСОК УСЛУГ */
                        <div className="space-y-3">
                          {listingsLoading && <p className="text-sm text-muted-foreground text-center py-4">Загрузка услуг...</p>}
                          
                          {!listingsLoading && listingsError && (
                            <div className="text-sm text-destructive p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                              {listingsError}
                            </div>
                          )}

                          {!listingsLoading && !listingsError && listings.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
                              У вас пока нет созданных услуг.
                            </div>
                          )}

                          {!listingsLoading && listings.map((listing) => (
                            <div
                              key={listing.id}
                              className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-all group"
                            >
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-foreground truncate">{listing.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{listing.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-medium text-primary">{listing.price} ₽</span>
                                  <span className="text-[10px] text-muted-foreground capitalize">({listing.priceType})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <button
                                  onClick={() => openEditListing(listing)}
                                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                  title="Редактировать"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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