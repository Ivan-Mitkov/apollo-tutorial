
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import { ApolloProvider, useQuery  } from '@apollo/react-hooks';

//for local state
import { resolvers, typeDefs } from './resolvers';

import Login from './pages/login';

import Pages from './pages';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/',
  // we need to attach our token to the GraphQL request's headers 
  //so our server can authorize the user. 
  headers: {
    // Specifying the headers option on HttpLink allows us to read the token 
    //from localStorage and attach it to the request's headers 
    //each time a GraphQL operation is made.
    authorization: localStorage.getItem('token'),
  },
  //for local state
  typeDefs,
  resolvers,
});

const client = new ApolloClient({
  cache,
  link
});

// client
//   .query({
//     query: gql`
//       query GetLaunch {
//         launch(id: 56) {
//           id
//           mission {
//             name
//           }
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));

//added default state to the Apollo cache
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  },
});
// Querying local data from the Apollo cache is almost the same as querying
// remote data from a graph API. The only difference is that 
//you add a @client directive to a local field to tell Apollo Client to pull it from the cache.
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    # First, we create our IsUserLoggedIn local query by adding the @client directive to the isLoggedIn field. 
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  // Then, we render a component with useQuery, pass our local query in,
  // and based on the response render either a login screen or the homepage 
  //depending if the user is logged in.
  // Since cache reads are synchronous, we don't have to account for any loading state.
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

ReactDOM.render(
    <ApolloProvider client={client}>
      <IsLoggedIn />
    </ApolloProvider>, document.getElementById('root')
  );