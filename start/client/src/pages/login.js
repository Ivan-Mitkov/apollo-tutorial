import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';
// Updating data with a useMutation hook from @apollo/react-hooks
// is very similar to fetching data with a useQuery hook. 
//The main difference is that the first value in the useMutation result tuple
// is a mutate function that actually triggers the mutation when it is called. 
//The second value in the result tuple is a result object that contains loading and error state,
// as well as the return value from the mutation.:
const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;
// Our useMutation hook returns a mutate function (login) and the data object returned
// from the mutation that we destructure from the tuple. 
//Finally, we pass our login function to the LoginForm component.
export default function Login() {

  // Sometimes, we need to access the ApolloClient instance to directly call a method
  // that isn't exposed by the @apollo/react-hooks helper components.
  // The useApolloClient hook can help us access the client.
  const client = useApolloClient();
  // call useApolloClient to get the currently configured client instance.
  
  const [login, { data }] = useMutation(LOGIN_USER,{
    // Next, we want to pass an onCompleted callback to useMutation 
  //that will be called once the mutation is complete with its return value.
  // This callback is where we will save the login token to localStorage.
    onCompleted({ login }) {
      localStorage.setItem('token', login);
      // In our onCompleted handler, we also call client.writeData to write local data
      // to the Apollo cache indicating that the user is logged in.
      // This is an example of a direct write
      client.writeData({ data: { isLoggedIn: true } });
    }
  });
  // Our useMutation hook returns a mutate function (login) and the data object returned 
  //from the mutation that we destructure from the tuple. 
  return <LoginForm login={login} />;
}