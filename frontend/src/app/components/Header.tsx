import { Link } from "react-router";
import { Search, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">FL</span>
          </div>
          <span className="text-xl font-bold">FreelanSearch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/search" className="hover:text-blue-600">
            Найти фрилансера
          </Link>
        
          <Link to="/dashboard" className="hover:text-blue-600">
            Личный кабинет
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Войти</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Регистрация</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/search" className="hover:text-blue-600">
              Найти фрилансера
            </Link>
        
            <Link to="/dashboard" className="hover:text-blue-600">
              Личный кабинет
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="ghost" asChild>
                <Link to="/login">Войти</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Регистрация</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}