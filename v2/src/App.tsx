import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import MainPage from '@/pages/MainPage';

function App() {
  const client = new ApolloClient({
    uri: import.meta.env.VITE_MIMIR_URL,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <MainPage />
    </ApolloProvider>
  );
}

export default App;
