const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api/v1').replace(/\/$/, '');
const STORAGE_KEY = 'freelancehub.currentUser';

export type FreelancerCard = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  description: string;
  skills: string[];
  shortDescription: string;
  rating: number | null;
  ratingsCount: number;
};

export type PortfolioAlbum = {
  albumId: number;
  title: string;
  description: string;
  fileLinks: string[];
  creationDate: string;
};

export type FreelancerProfile = FreelancerCard & {
  portfolio: PortfolioAlbum[];
};

export type OrderCard = {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  expectedPayment: number;
  deadline: string;
  publicationDate: string;
  employerUserId: number;
  employerName: string;
  employerDescription: string;
};

export type ContractCard = {
  contractId: number;
  status: string;
  paymentAmount: number;
  deadline: string;
  conclusionDate: string;
  employerName: string;
  orderTitle: string;
  employerRating: number | null;
  freelancerRating: number | null;
};

export type ResponseCard = {
  id: number;
  title: string;
  status: string;
  responseDate: string;
  projectTitle: string;
  clientName: string;
  expectedPayment: number;
  deadline: string;
  contract: ContractCard | null;
};

export type ProjectApplicant = {
  responseId: number;
  title: string;
  status: string;
  responseDate: string;
  freelancerId: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  skills: string[];
  description: string;
};

export type EmployerProject = {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  expectedPayment: number;
  deadline: string;
  publicationDate: string;
  responses: ProjectApplicant[];
};

export type HomeStats = {
  freelancerCount: number;
  orderCount: number;
  topFreelancers: FreelancerCard[];
};

export type CurrentUser = {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  freelancerId: number | null;
  employerId: number | null;
  token: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  skills?: string;
  description?: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
};

type AuthResponse = ApiEnvelope<{
  userId: string;
  status: string;
  token: string;
}>;

type ProfileResponse = {
  id: number;
  email?: string;
  phone?: string | null;
  role?: string;
  is_blocked?: boolean;
  created_at?: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  city?: string | null;
  avg_rating?: number | null;
  reviews_count?: number;
  updated_at?: string;
};

type UserServiceResponse = {
  id: number;
  title: string;
  description?: string | null;
  execution_period_days?: number;
  price?: number | null;
  price_type?: 'fixed' | 'negotiable' | 'free';
  status?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  created_at?: string;
  updated_at?: string;
};

type DealResponse = {
  id: number;
  client: {
    id: number;
    display_name: string;
    avatar_url?: string | null;
  };
  executor: {
    id: number;
    display_name: string;
    avatar_url?: string | null;
  };
  service: {
    id?: number | null;
    title: string;
  };
  status: string;
  created_at: string;
  completed_at?: string | null;
  payment?: number;
};

type ReviewResponse = {
  id: number;
  deal_id: number;
  rating: number;
  comment?: string | null;
  author: {
    id: number;
    display_name: string;
    avatar_url?: string | null;
  };
  target_role: string;
  created_at: string;
};

function getStoredToken() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    return (JSON.parse(rawValue) as Partial<CurrentUser>).token ?? null;
  } catch {
    return null;
  }
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return API_BASE_URL.startsWith('http') ? url.href : url.pathname + url.search;
}

async function restRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean; query?: Record<string, string | number | undefined> } = {},
) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | T | null;

  if (!response.ok) {
    const message = getErrorMessage(payload) ?? `Backend returned ${response.status}`;
    throw new Error(message);
  }

  return unwrapPayload<T>(payload);
}

function unwrapPayload<T>(payload: ApiEnvelope<T> | T | null) {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  if ('data' in payload && payload.data && typeof payload.data === 'object' && 'message' in payload.data) {
    const message = payload.data.message;
    return typeof message === 'string' ? message : null;
  }

  return null;
}

function truncate(text: string, maxLength = 140) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

function mapProfileToFreelancer(profile: ProfileResponse, services: UserServiceResponse[] = []): FreelancerCard {
  const description = profile.bio || 'Описание пока не заполнено.';
  const skills = services.flatMap((service) => service.tags?.map((tag) => tag.name) ?? []);
  const uniqueSkills = Array.from(new Set(skills));

  return {
    id: profile.id,
    fullName: profile.display_name || `Пользователь #${profile.id}`,
    email: profile.email ?? 'Скрыто',
    phoneNumber: profile.phone ?? 'Скрыто',
    description,
    skills: uniqueSkills.length ? uniqueSkills : [profile.city, profile.role].filter((item): item is string => Boolean(item)),
    shortDescription: truncate(description),
    rating: profile.avg_rating ?? null,
    ratingsCount: profile.reviews_count ?? 0,
  };
}

function mapServiceToPortfolio(service: UserServiceResponse): PortfolioAlbum {
  return {
    albumId: service.id,
    title: service.title,
    description: service.description || 'Описание услуги не указано.',
    fileLinks: [],
    creationDate: service.created_at ?? service.updated_at ?? new Date().toISOString(),
  };
}

function mapServiceToOrder(service: UserServiceResponse, owner?: ProfileResponse): OrderCard {
  const createdAt = service.created_at ?? new Date().toISOString();
  const deadline = service.execution_period_days
    ? new Date(Date.now() + service.execution_period_days * 24 * 60 * 60 * 1000).toISOString()
    : createdAt;

  return {
    id: service.id,
    title: service.title,
    description: service.description || 'Описание услуги не указано.',
    requiredSkills: service.tags?.map((tag) => tag.name) ?? [],
    expectedPayment: service.price ?? 0,
    deadline,
    publicationDate: createdAt,
    employerUserId: owner?.id ?? 0,
    employerName: owner?.display_name ?? 'Пользователь',
    employerDescription: owner?.bio ?? 'Описание профиля не указано.',
  };
}

function mapDealToContract(deal: DealResponse): ContractCard {
  return {
    contractId: deal.id,
    status: deal.status,
    paymentAmount: deal.payment ?? 0,
    deadline: deal.completed_at ?? deal.created_at,
    conclusionDate: deal.created_at,
    employerName: deal.client.display_name,
    orderTitle: deal.service.title,
    employerRating: null,
    freelancerRating: null,
  };
}

function mapDealToResponse(deal: DealResponse): ResponseCard {
  return {
    id: deal.id,
    title: deal.service.title,
    status: deal.status === 'in_progress' ? 'accepted' : deal.status,
    responseDate: deal.created_at,
    projectTitle: deal.service.title,
    clientName: deal.client.display_name,
    expectedPayment: deal.payment ?? 0,
    deadline: deal.completed_at ?? deal.created_at,
    contract: mapDealToContract(deal),
  };
}

async function fetchOwnProfile() {
  return restRequest<ProfileResponse>('/users/me', { auth: true });
}

async function fetchUserServices(userId: number) {
  return restRequest<{ items: UserServiceResponse[] }>(`/users/${userId}/services`)
    .then((data) => data?.items ?? [])
    .catch(() => []);
}

async function fetchCurrentUserServices() {
  return restRequest<{ items: UserServiceResponse[] }>('/users/me/services', { auth: true })
    .then((data) => data?.items ?? []);
}

async function fetchCurrentUserDeals(role?: 'customer' | 'freelancer') {
  return restRequest<{ items: DealResponse[] }>('/users/me/deals', {
    auth: true,
    query: { role },
  }).then((data) => data?.items ?? []);
}

async function fetchCurrentUserReviews(role: 'customer' | 'freelancer') {
  return restRequest<{ items: ReviewResponse[]; summary?: { total_count: number; avg_rating: number } }>('/users/me/reviews', {
    auth: true,
    query: { role },
  }).then((data) => data?.items ?? []);
}

export async function fetchFreelancers() {
  const ids = Array.from({ length: 20 }, (_, index) => index + 1);
  const profiles = await Promise.all(
    ids.map((id) => restRequest<ProfileResponse>(`/users/${id}`).catch(() => null)),
  );

  const freelancers = await Promise.all(
    profiles
      .filter((profile): profile is ProfileResponse => Boolean(profile))
      .map(async (profile) => mapProfileToFreelancer(profile, await fetchUserServices(profile.id))),
  );

  return freelancers.filter((freelancer) => freelancer.skills.length > 0 || freelancer.description);
}

export async function login(input: LoginInput) {
  const auth = await restRequest<AuthResponse['data']>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!auth?.token || !auth.userId) {
    throw new Error('Сервер не вернул токен авторизации');
  }

  return fetchCurrentUserWithToken(Number(auth.userId), auth.token, input.email);
}

export async function register(input: RegisterInput) {
  const auth = await restRequest<AuthResponse['data']>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      name: input.fullName,
    }),
  });

  if (!auth?.token || !auth.userId) {
    throw new Error('Сервер не вернул токен авторизации');
  }

  return fetchCurrentUserWithToken(Number(auth.userId), auth.token, input.email, input.fullName, input.phoneNumber);
}

async function fetchCurrentUserWithToken(
  userId: number,
  token: string,
  fallbackEmail?: string,
  fallbackName?: string,
  fallbackPhone?: string,
) {
  const previousValue = localStorage.getItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId, token }));

  try {
    const profile = await fetchOwnProfile();
    return mapProfileToCurrentUser(profile, token);
  } catch (error) {
    if (previousValue) {
      localStorage.setItem(STORAGE_KEY, previousValue);
    }

    return {
      userId,
      fullName: fallbackName ?? `Пользователь #${userId}`,
      email: fallbackEmail ?? '',
      phoneNumber: fallbackPhone ?? '',
      freelancerId: userId,
      employerId: userId,
      token,
    } satisfies CurrentUser;
  }
}

function mapProfileToCurrentUser(profile: ProfileResponse, token: string): CurrentUser {
  const role = profile.role?.toLowerCase();

  return {
    userId: profile.id,
    fullName: profile.display_name || `Пользователь #${profile.id}`,
    email: profile.email ?? '',
    phoneNumber: profile.phone ?? '',
    freelancerId: role === 'customer' ? null : profile.id,
    employerId: role === 'freelancer' ? null : profile.id,
    token,
  };
}

export async function fetchCurrentUser(_userId?: number) {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  const profile = await fetchOwnProfile();
  return mapProfileToCurrentUser(profile, token);
}

export async function fetchFreelancerProfile(id: number) {
  const profile = await restRequest<ProfileResponse>(`/users/${id}`).catch(() => null);
  if (!profile) {
    return null;
  }

  const services = await fetchUserServices(id);

  return {
    ...mapProfileToFreelancer(profile, services),
    portfolio: services.map(mapServiceToPortfolio),
  } satisfies FreelancerProfile;
}

export async function fetchOrders() {
  const services = await fetchCurrentUserServices().catch(() => []);
  const owner = await fetchOwnProfile().catch(() => undefined);

  return services.map((service) => mapServiceToOrder(service, owner));
}

export async function createOrderResponse(_orderId: number, _title: string, _freelancerId: number) {
  throw new Error('Отправка откликов не поддерживается текущим REST API');
}

export async function fetchMyProfileData(freelancerId: number) {
  const [profile, services, deals, reviews] = await Promise.all([
    fetchOwnProfile(),
    fetchCurrentUserServices(),
    fetchCurrentUserDeals('freelancer'),
    fetchCurrentUserReviews('freelancer').catch(() => []),
  ]);

  const freelancer = mapProfileToFreelancer({
    ...profile,
    avg_rating: reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : profile.avg_rating,
    reviews_count: reviews.length || profile.reviews_count,
  }, services);

  return {
    freelancerId,
    profile: freelancer,
    portfolio: services.map(mapServiceToPortfolio),
    contracts: deals.map(mapDealToContract),
    responses: deals.map(mapDealToResponse),
  };
}

export async function fetchEmployerProjects(_employerId: number) {
  const [profile, services, deals] = await Promise.all([
    fetchOwnProfile(),
    fetchCurrentUserServices(),
    fetchCurrentUserDeals('customer').catch(() => []),
  ]);

  return services.map((service) => ({
    ...mapServiceToOrder(service, profile),
    responses: deals
      .filter((deal) => deal.service.id === service.id)
      .map((deal) => ({
        responseId: deal.id,
        title: deal.service.title,
        status: deal.status === 'in_progress' ? 'accepted' : deal.status,
        responseDate: deal.created_at,
        freelancerId: deal.executor.id,
        userId: deal.executor.id,
        fullName: deal.executor.display_name,
        email: 'Скрыто',
        phoneNumber: 'Скрыто',
        skills: [],
        description: 'Описание профиля не указано.',
      })),
  }));
}

export async function deleteOrderResponse(_responseId: number, _freelancerId: number) {
  throw new Error('Удаление откликов не поддерживается текущим REST API');
}

export async function createContract(_orderId: number, _freelancerId: number, _paymentAmount: number, _deadline: string) {
  throw new Error('Создание контрактов не поддерживается текущим REST API');
}

export async function acceptContract(_contractId: number, _freelancerId: number) {
  throw new Error('Подтверждение контрактов не поддерживается текущим REST API');
}

export async function rejectContract(_contractId: number, _freelancerId: number) {
  throw new Error('Отклонение контрактов не поддерживается текущим REST API');
}

export async function fetchHomeStats() {
  const [freelancers, orders] = await Promise.all([fetchFreelancers(), fetchOrders().catch(() => [])]);

  return {
    freelancerCount: freelancers.length,
    orderCount: orders.length,
    topFreelancers: freelancers.slice(0, 4),
  } satisfies HomeStats;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
