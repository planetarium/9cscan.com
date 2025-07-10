import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

function App() {
  const client = new ApolloClient({
    uri: import.meta.env.VITE_MIMIR_URL,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="relative w-full bg-background h-screen pt-5">test</div>
    </ApolloProvider>
  );
}

export default App;
