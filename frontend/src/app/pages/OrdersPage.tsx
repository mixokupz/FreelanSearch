import { useState } from 'react';
import { Clock, DollarSign, Tag, User } from 'lucide-react';
import { createOrderResponse, fetchOrders, formatDate, formatMoney } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useAsyncData } from '../lib/useAsyncData';

export function OrdersPage() {
  const { data: orders, loading, error } = useAsyncData(fetchOrders, []);
  const { currentUser } = useAuth();
  const [respondedOrders, setRespondedOrders] = useState<Set<number>>(new Set());
  const [submittingOrderId, setSubmittingOrderId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleRespond(orderId: number, orderTitle: string) {
    if (!currentUser?.freelancerId) {
      setSubmitError('Войдите как фрилансер, чтобы отправить отклик');
      return;
    }

    const order = orders?.find((item) => item.id === orderId);
    if (order?.employerUserId === currentUser.userId) {
      setSubmitError('Нельзя откликнуться на свой заказ');
      return;
    }

    try {
      setSubmittingOrderId(orderId);
      setSubmitError(null);
      await createOrderResponse(
        orderId,
        `Отклик по заказу "${orderTitle}"`,
        currentUser.freelancerId,
      );
      setRespondedOrders((current) => new Set([...current, orderId]));
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : 'Не удалось отправить отклик');
    } finally {
      setSubmittingOrderId(null);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Активные заказы</h1>
          <p className="text-muted-foreground">
            Выберите интересный проект и отправьте отклик.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
            Ошибка отправки отклика: {submitError}
          </div>
        )}

        {loading && <p className="text-muted-foreground">Загружаем заказы...</p>}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось получить список заказов: {error}
          </div>
        )}

        {!loading && !error && orders?.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
            В базе пока нет заказов.
          </div>
        )}

        <div className="space-y-5">
          {orders?.map((order) => {
            const responded = respondedOrders.has(order.id);
            const submitting = submittingOrderId === order.id;
            const isOwnOrder = order.employerUserId === currentUser?.userId;
            const respondDisabled = responded || submitting || !currentUser?.freelancerId || isOwnOrder;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      
                      <span className="text-sm text-muted-foreground">
                        Опубликован {formatDate(order.publicationDate)}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-foreground">{order.title}</h3>

                    <p className="mb-4 leading-relaxed text-muted-foreground">{order.description}</p>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {order.requiredSkills.map((skill) => (
                        <span key={skill} className="rounded-lg bg-muted px-3 py-1 text-sm text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mb-5 flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{formatMoney(order.expectedPayment)} ₽</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Срок до {formatDate(order.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span>{order.employerName}</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                      <div className="mb-1 font-medium text-foreground">О заказчике</div>
                      <p>{order.employerDescription}</p>
                    </div>
                  </div>

                  <div className="lg:ml-6 flex-shrink-0">
                    <button
                      onClick={() => handleRespond(order.id, order.title)}
                      disabled={respondDisabled}
                      className={`rounded-xl px-8 py-3 font-semibold transition-all whitespace-nowrap ${
                        respondDisabled
                          ? 'cursor-not-allowed bg-muted text-muted-foreground'
                          : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      {isOwnOrder
                        ? 'Ваш заказ'
                        : responded
                          ? 'Отклик отправлен ✓'
                          : submitting
                            ? 'Отправляем...'
                            : currentUser?.freelancerId
                              ? 'Откликнуться'
                              : 'Войдите для отклика'}
                    </button>
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
