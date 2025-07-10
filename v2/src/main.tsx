import React from 'react';
import ReactDOM from 'react-dom/client';
import { initGA } from './analytics';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import routers from './routes.tsx';

if (import.meta.env.PROD) {
  initGA();
}

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: root exists in index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routers} />
    </QueryClientProvider>
  </React.StrictMode>
);
