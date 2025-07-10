import { NavLink } from 'react-router-dom';

import ROUTES from '@/constants/routes';

export default function MainPage() {
  return (
    <NavLink to={ROUTES.MAIN} className="w-max">
      <button type="button" className="mt-3 btn">
        Account settings
      </button>
    </NavLink>
  );
}
