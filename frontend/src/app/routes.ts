import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { StartPage } from './pages/StartPage';
import { FreelancersPage } from './pages/FreelancersPage';
import { OrdersPage } from './pages/OrdersPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { SearchPage } from './pages/SearchPage';
import { AuthPage } from './pages/AuthPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: StartPage },
      { path: 'freelancers', Component: FreelancersPage },
      { path: 'orders', Component: OrdersPage },
      { path: 'search', Component: SearchPage },
      { path: 'my-profile', Component: MyProfilePage },
      { path: 'freelancer/:id', Component: FreelancerProfilePage },
      { path: 'auth', Component: AuthPage },
    ],
  },
]);
