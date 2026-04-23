import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            К сожалению, страница, которую вы ищете, не существует или была
            перемещена.
          </p>
          <Button size="lg" asChild>
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </div>

    
    </div>
  );
}
