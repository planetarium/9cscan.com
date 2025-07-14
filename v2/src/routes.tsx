import ROUTES from '@/constants/routes';
import { MainPage } from '@/pages';
import BlockPage from '@/pages/BlockPage';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';
import TransactionPage from '@/pages/TransactionPage';
import BlockListPage from '@/pages/BlockListPage';
import TransactionListPage from '@/pages/TransactionListPage';
import { AccountPage } from '@/pages/AccountPage';
import AvatarPage from '@/pages/AvatarPage';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Root from './App';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={'/'} element={<Root />} errorElement={<ErrorPage />}>
      <Route index path={ROUTES.MAIN} element={<MainPage />} />
      <Route path="/block/:index" element={<BlockPage />} />
      <Route path="/transaction/:id" element={<TransactionPage />} />
      <Route path="/blocks" element={<BlockListPage />} />
      <Route path="/transactions" element={<TransactionListPage />} />
      <Route path="/account/:address" element={<AccountPage />} />
      <Route path="/avatar/:address" element={<AvatarPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;
