import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FL</span>
              </div>
              <span className="text-xl font-bold text-white">FreelanceHub</span>
            </div>
            <p className="text-sm">
              Платформа для поиска профессиональных фрилансеров и заказа услуг
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Для клиентов</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="hover:text-white">
                  Найти исполнителя
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white">
                  Категории услуг
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Для фрилансеров</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Предлагать услуги
                </Link>
              </li>
              <li>
                <Link to="/service/create" className="hover:text-white">
                  Создать услугу
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Помощь
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Безопасность
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Условия использования
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 FreelanceHub. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}