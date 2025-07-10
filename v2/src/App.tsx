import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function App() {
  const client = new ApolloClient({
    uri: import.meta.env.VITE_MIMIR_URL,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Header />
      <div className="min-h-[80vh]">
        <Outlet />
      </div>
      <Footer />
    </ApolloProvider>
  );
}

export default App;
