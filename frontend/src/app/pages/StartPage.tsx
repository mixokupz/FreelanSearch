import { Link } from 'react-router';
import { Users, Briefcase } from 'lucide-react';

export function StartPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            FreelanceHub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Платформа для поиска фрилансеров и заказов
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/freelancers"
            className="group w-72 px-8 py-8 bg-gradient-to-br from-primary to-primary/90 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center gap-3">
              <Users className="w-12 h-12" />
              <span className="text-2xl font-semibold">Фрилансеры</span>
              <span className="text-sm text-white/80">Найти специалиста</span>
            </div>
          </Link>
          <Link
            to="/orders"
            className="group w-72 px-8 py-8 bg-gradient-to-br from-secondary to-secondary/90 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center gap-3">
              <Briefcase className="w-12 h-12" />
              <span className="text-2xl font-semibold">Заказы</span>
              <span className="text-sm text-white/80">Найти проект</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}