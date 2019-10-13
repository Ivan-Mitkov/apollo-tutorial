import gql from "graphql-tag";
import { GET_CART_ITEMS } from "./pages/cart";

//Adding virtual fields to server data
// One of the unique advantages of managing your local data with Apollo Client is that
// you can add virtual fields to data you receive back from your graph API.
// These fields only exist on the client and are useful for decorating server data with local state.
// In our example, we're going to add an isInCart virtual field to our Launch type.

// To add a virtual field, first extend the type of the data
//you're adding the field to in your client schema. Here, we're extending the Launch type:
export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

// write a client schema and resolvers for your local data.
//You'll also learn to query it with GraphQL just by specifying the @client directive.

// To build a client schema, we extend the types of our server schema
//and wrap it with the gql function. Using the extend keyword allows us
//to combine both schemas inside developer tooling like Apollo VSCode and Apollo DevTools.

// We can also add local fields to server data by extending types from our server.
// Here, we're adding the isInCart local field to the Launch type we receive back from our graph API.
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

//Adding virtual fields to server data
// Next, specify a client resolver on the Launch type to tell Apollo Client
// how to resolve your virtual field

// we destructure the Apollo cache from the context in order to read the query 
//that fetches cart items. Once we have our cart data, 
//we either remove or add the cart item's id passed into the mutation to the list.
// Finally, we return the updated list from the mutation.
export const resolvers = {
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id]
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    }
  }
};
