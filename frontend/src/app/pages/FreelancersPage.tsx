import { Link } from 'react-router';
import { ArrowRight, Mail, Phone, Star } from 'lucide-react';
import { fetchFreelancers } from '../lib/api';
import { useAsyncData } from '../lib/useAsyncData';

function formatRating(rating: number | null) {
  return rating === null ? 'Новый' : rating.toFixed(1);
}

export function FreelancersPage() {
  const { data: freelancers, loading, error } = useAsyncData(fetchFreelancers, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Список фрилансеров</h1>
          <p className="text-muted-foreground">
            Найдите специалиста для своего проекта.
          </p>
        </div>

        {loading && <p className="text-muted-foreground">Загружаем список специалистов...</p>}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось получить фрилансеров: {error}
          </div>
        )}

        {!loading && !error && freelancers?.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
            В базе пока нет фрилансеров.
          </div>
        )}

        <div className="space-y-4">
          {freelancers?.map((freelancer) => (
            <Link
              key={freelancer.id}
              to={`/freelancer/${freelancer.id}`}
              className="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg group"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-2xl font-semibold text-primary">
                  {freelancer.fullName.slice(0, 1)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {freelancer.fullName}
                      </h3>
                      <p className="mt-1 text-muted-foreground">{freelancer.shortDescription}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{formatRating(freelancer.rating)}</span>
                      <span className="text-muted-foreground">
                        {freelancer.ratingsCount > 0 ? `${freelancer.ratingsCount} оцен.` : 'профиль'}
                      </span>
                    </div>
                   
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-muted px-3 py-1 text-sm text-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{freelancer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{freelancer.phoneNumber}</span>
                    </div>
                    <div className="md:ml-auto flex items-center gap-2 text-primary">
      
                      <span className="font-medium">Открыть профиль</span>
                      <ArrowRight className="h-4 w-4" />
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
