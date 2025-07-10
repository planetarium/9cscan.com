import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Outlet } from 'react-router-dom';

function App() {
  const client = new ApolloClient({
    uri: import.meta.env.VITE_MIMIR_URL,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
