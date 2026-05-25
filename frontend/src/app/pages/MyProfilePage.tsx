import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Mail,
  Phone,
  Star,
  Trash2,
  UserCircle,
  Users,
  XCircle,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  acceptContract,
  createContract,
  deleteOrderResponse,
  fetchEmployerProjects,
  fetchMyProfileData,
  formatDate,
  formatMoney,
  rejectContract,
  type EmployerProject,
  type ProjectApplicant,
  type ResponseCard,
} from '../lib/api';
import { useAuth } from '../lib/auth';
import { useAsyncData } from '../lib/useAsyncData';

const responseStatusText: Record<string, string> = {
  pending: 'В ожидании',
  accepted: 'Принят',
  rejected: 'Отклонён',
};

const contractStatusText: Record<string, string> = {
  active: 'Активен',
  completed: 'Завершён',
  cancelled: 'Отменён',
  disputed: 'Спор',
};

function getStatusColor(status: string) {
  switch (status) {
    case 'accepted':
      return 'bg-green-500/10 text-green-600';
    case 'rejected':
      return 'bg-red-500/10 text-red-600';
    case 'pending':
    default:
      return 'bg-blue-500/10 text-blue-600';
  }
}

function buildDeadline(days: string) {
  const date = new Date();
  date.setDate(date.getDate() + Number(days));
  return date.toISOString();
}

function formatRating(rating: number | null) {
  return rating === null ? 'Новый' : rating.toFixed(1);
}

export function MyProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const freelancerId = currentUser?.freelancerId ?? null;
  const employerId = currentUser?.employerId ?? null;
  const [isFreelancer, setIsFreelancer] = useState(Boolean(freelancerId));
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<ResponseCard | null>(null);
  const [selectedProject, setSelectedProject] = useState<EmployerProject | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ProjectApplicant | null>(null);
  const [contractForm, setContractForm] = useState({ payment: '', deadline: '' });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const freelancerState = useAsyncData(
    () => {
      if (!freelancerId) {
        return Promise.resolve(null);
      }

      return fetchMyProfileData(freelancerId);
    },
    [freelancerId, refreshKey],
  );

  const employerState = useAsyncData(
    () => {
      if (!employerId) {
        return Promise.resolve([]);
      }

      return fetchEmployerProjects(employerId);
    },
    [employerId, refreshKey],
  );

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-muted-foreground">Проверяем авторизацию...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  const canShowSwitcher = Boolean(freelancerId && employerId);
  const profile = freelancerState.data?.profile;
  const contracts = freelancerState.data?.contracts ?? [];
  const responses = freelancerState.data?.responses ?? [];
  const employerProjects = employerState.data ?? [];

  async function handleDeleteApplication(responseId: number) {
    if (!freelancerId) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await deleteOrderResponse(responseId, freelancerId);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Не удалось удалить отклик');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAcceptContract() {
    if (!freelancerId || !selectedResponse?.contract) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await acceptContract(selectedResponse.contract.contractId, freelancerId);
      setSelectedResponse(null);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Не удалось подтвердить контракт');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectContract() {
    if (!freelancerId || !selectedResponse?.contract) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await rejectContract(selectedResponse.contract.contractId, freelancerId);
      setSelectedResponse(null);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Не удалось отклонить контракт');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendContract() {
    if (!selectedProject || !selectedApplicant || !contractForm.payment || !contractForm.deadline) {
      return;
    }

    if (selectedApplicant.userId === currentUser.userId) {
      setActionError('Нельзя заключить контракт с самим собой');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await createContract(
        selectedProject.id,
        selectedApplicant.freelancerId,
        Number(contractForm.payment),
        buildDeadline(contractForm.deadline),
      );
      setSelectedApplicant(null);
      setSelectedProject(null);
      setContractForm({ payment: '', deadline: '' });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Не удалось создать контракт');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-3">Мой профиль</h1>
              <p className="text-muted-foreground">
                Управляйте профилем, откликами и контрактами.
              </p>
            </div>

            {canShowSwitcher && (
              <div className="bg-card border border-border rounded-2xl p-2 flex gap-2">
                <button
                  onClick={() => setIsFreelancer(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    isFreelancer
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  Фрилансер
                </button>
                <button
                  onClick={() => setIsFreelancer(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    !isFreelancer
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Заказчик
                </button>
              </div>
            )}
          </div>
        </div>

        {actionError && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
            {actionError}
          </div>
        )}

        {isFreelancer && !freelancerId && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
            У текущего пользователя нет профиля фрилансера.
          </div>
        )}

        {!isFreelancer && !employerId && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
            У текущего пользователя нет профиля заказчика.
          </div>
        )}

        {isFreelancer && freelancerId && (
          <>
            {freelancerState.loading && <p className="text-muted-foreground">Загружаем профиль...</p>}

            {freelancerState.error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                Не удалось загрузить профиль: {freelancerState.error}
              </div>
            )}

            {profile && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-5xl font-semibold text-primary">
                        {profile.fullName.slice(0, 1)}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">{profile.fullName}</h2>
                        <p className="text-muted-foreground">Фрилансер</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-xl">{formatRating(profile.rating)}</span>
                        <span className="text-muted-foreground text-sm">
                          {profile.ratingsCount > 0 ? `${profile.ratingsCount} оцен.` : 'профиль'}
                        </span>
                      </div>

                      <div className="w-full pt-6 border-t border-border space-y-4 text-left">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{profile.phoneNumber}</span>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">О себе</h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Навыки</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-muted text-foreground rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Мои отклики</h3>
                    {responses.length === 0 ? (
                      <div className="rounded-xl bg-muted/50 p-6 text-muted-foreground">
                        У вас пока нет откликов. Посмотрите доступные <Link to="/orders" className="text-primary hover:text-secondary">заказы</Link>.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {responses.map((response) => (
                          <div key={response.id} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow hover:border-primary/30">
                            <div className="mb-3 flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-semibold text-foreground mb-1">{response.projectTitle}</h4>
                                <p className="text-sm text-muted-foreground">{response.clientName}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs rounded-lg font-medium ${getStatusColor(response.status)}`}>
                                {responseStatusText[response.status] ?? response.status}
                              </span>
                            </div>

                            <div className="mb-4 grid gap-3 text-sm sm:grid-cols-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span>{formatMoney(response.expectedPayment)} ₽</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{formatDate(response.deadline)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{formatDate(response.responseDate)}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {response.status === 'accepted' && response.contract && (
                                <button
                                  onClick={() => setSelectedResponse(response)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  Контракт
                                </button>
                              )}
                              { (
                                <button
                                  onClick={() => handleDeleteApplication(response.id)}
                                  disabled={actionLoading}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all text-sm disabled:opacity-60"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Удалить
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Мои контракты</h3>
                    {contracts.length === 0 ? (
                      <p className="text-muted-foreground">Контрактов пока нет.</p>
                    ) : (
                      <div className="space-y-4">
                        {contracts.map((contract) => (
                          <div key={contract.contractId} className="border border-border rounded-xl p-5">
                            <div className="mb-4 flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-semibold text-foreground mb-1">{contract.orderTitle}</h4>
                                <p className="text-sm text-muted-foreground">{contract.employerName}</p>
                              </div>
                              <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {contractStatusText[contract.status] ?? contract.status}
                              </span>
                            </div>
                            <div className="grid gap-3 text-sm sm:grid-cols-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-foreground">{formatMoney(contract.paymentAmount)} ₽</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{formatDate(contract.deadline)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span>#{contract.contractId}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!isFreelancer && employerId && (
          <>
            {employerState.loading && <p className="text-muted-foreground">Загружаем проекты...</p>}

            {employerState.error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                Не удалось загрузить проекты: {employerState.error}
              </div>
            )}

            {!employerState.loading && !employerState.error && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Мои проекты</h3>
                {employerProjects.length === 0 ? (
                  <p className="text-muted-foreground">Вы пока не разместили проекты.</p>
                ) : (
                  <div className="space-y-4">
                    {employerProjects.map((project) => (
                      <div key={project.id} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow hover:border-primary/30">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-1">{project.title}</h4>
                            <p className="mb-3 text-sm text-muted-foreground">{project.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>Бюджет: {formatMoney(project.expectedPayment)} ₽</span>
                              <span>Срок: {formatDate(project.deadline)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">{project.responses.length}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Посмотреть отклики ({project.responses.length})
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <Dialog.Root open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-8">
              <Dialog.Title className="text-2xl font-bold text-foreground mb-6">Детали контракта</Dialog.Title>
              {selectedResponse?.contract && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{selectedResponse.projectTitle}</h3>
                    <p className="text-sm text-muted-foreground">{selectedResponse.clientName}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Оплата</div>
                        <div className="text-lg font-semibold text-foreground">
                          {formatMoney(selectedResponse.contract.paymentAmount)} ₽
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Срок выполнения</div>
                        <div className="text-lg font-semibold text-foreground">
                          {formatDate(selectedResponse.contract.deadline)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAcceptContract}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Подтвердить
                    </button>
                    <button
                      onClick={handleRejectContract}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-60"
                    >
                      <XCircle className="w-5 h-5" />
                      Отклонить
                    </button>
                  </div>
                </div>
              )}
              <Dialog.Close className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
                <XCircle className="w-6 h-6" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-8">
              <Dialog.Title className="text-2xl font-bold text-foreground mb-6">Отклики на проект</Dialog.Title>
              {selectedProject && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{selectedProject.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>

                  {selectedProject.responses.length === 0 ? (
                    <p className="text-muted-foreground">На этот проект пока нет откликов.</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedProject.responses.map((applicant) => {
                        const isSelfApplicant = applicant.userId === currentUser.userId;
                        const contractDisabled = applicant.status === 'accepted' || isSelfApplicant;

                        return (
                          <div key={applicant.responseId} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="mb-4 flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-3xl font-semibold text-primary">
                                {applicant.fullName.slice(0, 1)}
                              </div>
                              <div className="flex-1">
                                <div className="mb-1 flex items-center justify-between gap-3">
                                  <h4 className="text-lg font-semibold text-foreground">{applicant.fullName}</h4>
                                  <span className={`px-3 py-1 text-xs rounded-lg font-medium ${getStatusColor(applicant.status)}`}>
                                    {responseStatusText[applicant.status] ?? applicant.status}
                                  </span>
                                </div>
                                <p className="mb-3 text-sm text-muted-foreground">{applicant.description}</p>
                                <div className="mb-3 flex flex-wrap gap-2">
                                  {applicant.skills.slice(0, 5).map((skill) => (
                                    <span key={skill} className="rounded-lg bg-muted px-3 py-1 text-xs text-foreground">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span>{applicant.email}</span>
                                  <span>{applicant.phoneNumber}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 rounded-lg bg-muted p-4">
                              <p className="text-sm text-foreground">{applicant.title}</p>
                            </div>

                            <button
                              onClick={() => setSelectedApplicant(applicant)}
                              disabled={contractDisabled}
                              className="w-full px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isSelfApplicant
                                ? 'Это ваш отклик'
                                : applicant.status === 'accepted'
                                  ? 'Контракт уже предложен'
                                  : 'Заключить контракт'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <Dialog.Close className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
                <XCircle className="w-6 h-6" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-8">
              <Dialog.Title className="text-2xl font-bold text-foreground mb-6">Создание контракта</Dialog.Title>
              {selectedApplicant && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-2xl font-semibold text-primary">
                      {selectedApplicant.fullName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedApplicant.fullName}</h4>
                      <p className="text-sm text-muted-foreground">{selectedApplicant.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Итоговая оплата (₽)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="number"
                          placeholder="Введите сумму"
                          value={contractForm.payment}
                          onChange={(event) => setContractForm({ ...contractForm, payment: event.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Срок выполнения (дней)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="number"
                          placeholder="Введите количество дней"
                          value={contractForm.deadline}
                          onChange={(event) => setContractForm({ ...contractForm, deadline: event.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSendContract}
                      disabled={!contractForm.payment || !contractForm.deadline || actionLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отправить контракт
                    </button>
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
              <Dialog.Close className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
                <XCircle className="w-6 h-6" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
