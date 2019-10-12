const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

// import our createStore function to set up our database
const { createStore } = require('./utils');


const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// create our database by calling createStore
const store = createStore();

const server = new ApolloServer({
  typeDefs,
//   Add data sources to Apollo Server
//   Now that we've built our LaunchAPI data source to connect our REST API 
//and our UserAPI data source to connect our SQL database, we need to add them to our graph API.
  
//   Adding our data sources is simple. Just create a dataSources property 
//on your ApolloServer that corresponds to a function that returns an object 
//with your instantiated data sources.
// we add the dataSources function to our ApolloServer to connect LaunchAPI and UserAPI
// to our graph. We also pass in our database we created to the UserAPI data source.
// If you use this.context in your datasource, it's critical 
//to create a new instance in the dataSources function and to not share a single instance.
// Otherwise, initialize may be called during the execution of asynchronous code 
//for a specific user, and replace the this.context by the context of another user.
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});