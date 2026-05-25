import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Briefcase, Heart, Mail, Phone, Star } from 'lucide-react';
import { fetchFreelancerProfile, formatDate } from '../lib/api';
import { useAsyncData } from '../lib/useAsyncData';

function formatRating(rating: number | null) {
  return rating === null ? 'Новый' : rating.toFixed(1);
}

export function FreelancerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const freelancerId = Number(id);
  const { data: freelancer, loading, error } = useAsyncData(
    () => fetchFreelancerProfile(freelancerId),
    [freelancerId],
  );

  if (!Number.isFinite(freelancerId)) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Фрилансер не найден</h1>
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
        <button
          onClick={() => navigate('/freelancers')}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Назад к списку фрилансеров</span>
        </button>

        {loading && <p className="text-muted-foreground">Загружаем профиль...</p>}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            Не удалось загрузить профиль: {error}
          </div>
        )}

        {!loading && !error && !freelancer && (
          <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
            Фрилансер не найден.
          </div>
        )}

        {freelancer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-5xl font-semibold text-primary">
                    {freelancer.fullName.slice(0, 1)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      {freelancer.fullName}
                    </h2>
                    <p className="text-muted-foreground">{freelancer.skills.slice(0, 2).join(', ')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xl">{formatRating(freelancer.rating)}</span>
                    <span className="text-muted-foreground text-sm">
                      {freelancer.ratingsCount > 0 ? `${freelancer.ratingsCount} оцен.` : 'профиль'}
                    </span>
                  </div>

                
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">О специалисте</h3>
                <p className="text-muted-foreground leading-relaxed">{freelancer.description}</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Контакты</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{freelancer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{freelancer.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-muted text-foreground rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Портфолио</h3>
                {freelancer.portfolio.length === 0 ? (
                  <p className="text-muted-foreground">Работы пока не добавлены.</p>
                ) : (
                  <div className="space-y-3">
                    {freelancer.portfolio.map((project) => (
                      <div
                        key={project.albumId}
                        className="border border-border rounded-xl p-5 hover:shadow-md transition-all hover:border-primary/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{project.title}</h4>
                            <p className="mb-3 text-sm text-muted-foreground">{project.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Добавлено {formatDate(project.creationDate)}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.fileLinks.map((link) => (
                                <a
                                  key={link}
                                  href={link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/15"
                                >
                                  Ссылка
                                </a>
                              ))}
                            </div>
                          </div>
                          <Briefcase className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
