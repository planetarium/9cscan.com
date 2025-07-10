import ROUTES from '@/constants/routes';
import { NavLink, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div title="404 Not found">
      <p>Something went wrong.</p>

      <button type="button" className="btn mt-3" onClick={() => navigate(0)}>
        Reload page
      </button>

      <NavLink to={ROUTES.MAIN}>
        <button type="button" className="btn mt-3">
          Go to Home
        </button>
      </NavLink>
    </div>
  );
}
