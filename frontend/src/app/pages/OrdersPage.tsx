// src/app/pages/OrdersPage.tsx
import { useEffect, useState } from 'react';
import { Clock, DollarSign, Tag, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listingService } from '../../api/listingService';
import { ListingDetailsResponse } from '../../types/listing';
import { getFriendlyErrorMessage } from '../../api/errorUtils';

// Хелпер форматирования валюты (заменяем импорт, если старый удален)
function formatMoney(amount: number) {
  return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2 }).format(amount);
}

export function OrdersPage() {
  const { user: currentUser } = useAuth();
  
  // Стейты данных листинга
  const [listings, setListings] = useState<ListingDetailsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Стейты для отправки откликов
  const [respondedOrders, setRespondedOrders] = useState<Set<number>>(new Set());
  const [submittingOrderId, setSubmittingOrderId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Загрузка объявлений при монтировании
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listingService.getListings();
        // Фильтруем только активные заказы
        const activeListings = response.data.filter(item => item.status === 'active');
        setListings(activeListings);
      } catch (err) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

 
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Услуги</h1>
          <p className="text-muted-foreground">
            Выберите интересующее объявление и свяжитесь с исполнителем.
          </p>
        </div>

        

        {loading && <p className="text-muted-foreground text-center py-12">Загружаем услуги...</p>}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось получить список услуг: {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground text-center">
            В базе пока нет предлааемых услуг.
          </div>
        )}

        <div className="space-y-5">
          {!loading && listings.map((order) => {
            const responded = respondedOrders.has(order.id);
            const submitting = submittingOrderId === order.id;
            const respondDisabled = responded || submitting;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    
                    {/* Статус-тег */}
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 capitalize">
                        ● {order.status}
                      </span>
                    </div>

                    {/* Название и описание объявления */}
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{order.title}</h3>
                    <p className="mb-4 leading-relaxed text-muted-foreground">{order.description}</p>

                   

                    {/* Финансовые показатели */}
                    <div className="mb-5 flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {formatMoney(order.price)} ₽ 
                          <span className="text-xs text-muted-foreground font-normal ml-1">
                            ({order.priceType === 'fixed' ? 'Фиксированная' : order.priceType})
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs italic">Срок не указан</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-xs italic">Заказчик в системе</span>
                      </div>
                    </div>

                  </div>

                 
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}