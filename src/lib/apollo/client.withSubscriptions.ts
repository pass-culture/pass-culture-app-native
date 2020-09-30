// @graphql-subscriptions
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import AsyncStorage from '@react-native-community/async-storage';
import { env } from '../../environment';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types';
import { resolvers } from './resolvers';
import { getMainDefinition } from 'apollo-utilities';
import { useState, useEffect } from 'react';

// "link" is a middleware
// It takes an "operation" object (query, variables) and a "forward" function (next)
// The "forward" function allows chaining links to eachother
// https://www.apollographql.com/docs/link/overview/

// We mostly use standardized links but custom links are doable
// For example https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-error/src/index.ts#L33-L117

// Apollo exports links
// eg: setContext sets something in the request
const authorizationLink = setContext(async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  return {
    headers: { authorization: authToken },
  };
});

// HttpLink is the default "link" to handle HTTP requests
const httpLink = createHttpLink({
  uri: env.API_ENDPOINT,
  credentials: 'same-origin',
});

// WSLink is the default link to handle WS requests
const wsLink = new WebSocketLink({
  uri: env.WEBSOCKET_ENDPOINT,
  options: {
    reconnect: true,
  },
});

// Our "link" is either wsLink (without auth 🤯)
// Or a link combining
// - on error => to display errors
// - authorization => put the Auth header in the request
// - httpLink => execute the HTTP request
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    const isOperationASubscription =
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    return isOperationASubscription;
  },
  wsLink,
  ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.warn(`[Network error]: ${networkError}`);
    }),
    authorizationLink,
    httpLink,
  ])
);

// Apollo is stateless, which means we have to recompute on each request
// So we add a cache
// There are alternatives such as Hermes (NOT RN's JSC)
const cache = new InMemoryCache();

// We store the client in the state
export const useApolloClient = () => {
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();
  useEffect(() => {
    (async () => {
      // Wait for persist, cache hydration
      await persistCache({
        cache,
        storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
      });
      setApolloClient(
        // Create Link instance
        new ApolloClient({
          link,
          cache,
          resolvers,
        })
      );
    })();
  }, []);
  return apolloClient;
};
