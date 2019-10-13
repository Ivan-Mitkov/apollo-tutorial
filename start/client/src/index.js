import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import { ApolloProvider } from '@apollo/react-hooks';

import React from 'react';
import ReactDOM from 'react-dom';
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
ReactDOM.render(
    <ApolloProvider client={client}>
      <Pages />
    </ApolloProvider>, document.getElementById('root')
  );