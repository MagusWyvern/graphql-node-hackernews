const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// Note: The GraphQL schema is auto-generated from the GraphQL types we defined in our prisma schema.

// Implementation of the GraphQL Schema
const resolvers = {
  Query,
  Mutation,
  User,
  Link
}

const prisma = new PrismaClient()

// Bundle Schema and Resolvers and pass them to Apollo
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  },
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );