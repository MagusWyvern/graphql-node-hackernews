const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Note: The GraphQL schema is auto-generated from the GraphQL types we defined in our prisma schema.

// Implementation of the GraphQL Schema
const resolvers = {
  Query: {

    // Return the info for the API
    info: () => `This is the API of a Hackernews Clone`,

    // Use prisma client to access the API using the context argument
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },

    // Find a link by its ID
    link: (parent, args, context) => {

      const oneLink = context.prisma.link.findUnique({
        where: {
          id: parseInt(args.id),
        },
      })
      return oneLink


    }
  },


  Mutation: {
    // Create a new link
    post: (parent, args, context, info) => {
      
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },

    // Use prisma client to update a link
    updateLink: async (parent, args, context) => {

      const updatedLink = context.prisma.link.update({
        where: {
          id: parseInt(args.id),
        },
        data: {
          description: args.description,
          url: args.url,
        },
      })

      return updatedLink

    },

    // Use prisma client to delete a link
    deleteLink: async (parent, args, context) => {
      return context.prisma.link.delete({
        where: {
          id: args.id,
        },
      })
    },

  },
}

const prisma = new PrismaClient()

// Bundle Schema and Resolvers and pass them to Apollo
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
