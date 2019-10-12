const { ApolloServer } = require("apollo-server");
const isEmail = require("isemail");

const typeDefs = require("./schema");

// connect our resolver map to Apollo Server
const resolvers = require("./resolvers");

// import our createStore function to set up our database
const { createStore } = require("./utils");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

// create our database by calling createStore
const store = createStore();

//   Add data sources to Apollo Server
//   Now that we've built our LaunchAPI data source to connect our REST API
//and our UserAPI data source to connect our SQL database, we need to add them to our graph API.

const server = new ApolloServer({
  //   The context function on your ApolloServer instance is called with the request object
  // each time a GraphQL operation hits your API. Use this request object to read
  //the authorization headers.
  // Authenticate the user within the context function.
  // Once the user is authenticated, attach the user to the object returned
  //from the context function. This allows us to read the user's information 
  //from within our data sources and resolvers, so we can authorize whether they can access the data.
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,

  resolvers,
  //   Adding our data sources is simple. Just create a dataSources property
  //on your ApolloServer that corresponds to a function that returns an object
  //with your instantiated data sources.
  // we add the dataSources function to our ApolloServer to connect LaunchAPI and UserAPI
  // to our graph. We also pass in our database we created to the UserAPI data source.
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    // If you use this.context in your datasource, it's critical
    //to create a new instance in the dataSources function and to not share a single instance.
    // Otherwise, initialize may be called during the execution of asynchronous code
    //for a specific user, and replace the this.context by the context of another user.
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
