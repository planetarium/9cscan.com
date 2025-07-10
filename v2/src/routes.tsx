import ROUTES from '@/constants/routes';
import { MainPage } from '@/pages';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Root from './App';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={'/'} element={<Root />} errorElement={<ErrorPage />}>
      <Route index path={ROUTES.MAIN} element={<MainPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;
