import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Mail, Phone, Search, Star } from 'lucide-react';
import { fetchFreelancers } from '../lib/api';
import { useAsyncData } from '../lib/useAsyncData';

const categories = [
  { value: 'all', label: 'Все специалисты' },
  { value: 'design', label: 'Дизайн' },
  { value: 'development', label: 'Разработка' },
  { value: 'marketing', label: 'Маркетинг и контент' },
];

function matchesCategory(text: string, category: string) {
  const normalized = text.toLowerCase();

  if (category === 'design') {
    return /design|дизайн|figma|illustrator|photoshop|ui|ux/.test(normalized);
  }

  if (category === 'development') {
    return /react|python|django|node|backend|frontend|разработ/.test(normalized);
  }

  if (category === 'marketing') {
    return /seo|smm|контент|marketing|копирайт/.test(normalized);
  }

  return true;
}

function formatRating(rating: number | null) {
  return rating === null ? 'Новый' : rating.toFixed(1);
}

export function FreelancerSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: freelancers, loading, error } = useAsyncData(fetchFreelancers, []);

  const filteredFreelancers = useMemo(() => {
    if (!freelancers) {
      return [];
    }

    return freelancers.filter((freelancer) => {
      const searchTarget = [
        freelancer.fullName,
        freelancer.description,
        freelancer.skills.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' || searchTarget.includes(searchQuery.trim().toLowerCase());

      const matchesSelectedCategory =
        selectedCategory === 'all' || matchesCategory(searchTarget, selectedCategory);

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
            Подберите исполнителя по навыкам, опыту и специализации.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по имени, описанию или навыкам..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-border bg-input-background px-6 py-4 pl-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Категория</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-lg border border-border bg-input-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="rounded-lg bg-secondary/10 px-4 py-3 text-secondary">
                Найдено специалистов: <span className="font-semibold">{filteredFreelancers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Загружаем профили...</p>}
        {error && <p className="text-destructive">Ошибка загрузки: {error}</p>}

        <div className="grid gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Link
              key={freelancer.id}
              to={`/freelancer/${freelancer.id}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-5xl font-semibold text-primary shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {freelancer.fullName.slice(0, 1)}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <h3 className="text-2xl font-semibold text-primary">{freelancer.fullName}</h3>
                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{formatRating(freelancer.rating)}</span>
                      <span className="text-muted-foreground">
                        {freelancer.ratingsCount > 0 ? `${freelancer.ratingsCount} оцен.` : 'профиль'}
                      </span>
                    </div>
                  </div>
                  <p className="mb-4 text-muted-foreground">{freelancer.description}</p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{freelancer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{freelancer.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="font-medium text-primary">Открыть профиль</div>
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
