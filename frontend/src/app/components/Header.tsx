import { Link, useLocation } from 'react-router';
import { Zap, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function Header() {
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  const isAuthPage = location.pathname === '/auth';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FreelanceHub</span>
          </Link>
          {!isAuthPage && (
            <div className="flex items-center gap-3">
              {!currentUser && (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  Вход
                </Link>
              )}
              {currentUser && (
                <>
                  <Link
                    to="/my-profile"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    Мой профиль
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-xl hover:bg-muted transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </>
              )}
            </div>)}
        </div>
      </div>
    </header>
  );
}
