import ROUTES from '@/constants/routes';
import { NavLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-4">페이지를 찾을 수 없습니다.</p>
      <NavLink to={ROUTES.MAIN}>
        <button type="button" className="btn mt-3">
          Go to Home
        </button>
      </NavLink>
    </div>
  );
}
