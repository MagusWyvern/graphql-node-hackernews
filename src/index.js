const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Hard-coded dummy data for testing
let links = [
  { 
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
  },

  {
  id: 'link-1',
  url: 'https://www.prisma.io/',
  description: 'Next-generation Node.js and TypeScript ORM'  
  },

  {
  id: 'link-2',
  url: 'https://d3js.org/',
  description: 'D3.js is a JavaScript library for manipulating documents based on data.'
  }
]

// Implementation of the GraphQL Schema
const resolvers = {
  Query: {

    info: () => `This is the API of a Hackernews Clone`,

    // Return the dummy data for feed query
    // feed: () => links,

    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },

    link: (_, { id }) => {
      let idCount = links.length;
      
      // We iterate through the array, if the object's id matches queried id, return it.

        for (let i = 0; i < idCount; i++){
          if (links[i].id == id) {
            return links[i]
          }
        }
      

      // If all else fails, uncomment the code below to return the first link anyway
      return links[0]
    }

  },


  Mutation: {
    // post: (parent, args) => {
  
    // let idCount = links.length

    //    const link = {
    //     id: `link-${idCount++}`,
    //     description: args.description,
    //     url: args.url,
    //   }
    //   links.push(link)
    //   return link
    // },
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },


    updateLink: (_, args) => {
      let id = args.id
      let url = args.description
      let description = args.description
      let idCount = links.length;
      
      // We iterate through the array, if the object's id matches queried id, return it.
      
      for (let i = 0; i < idCount; i++){
        if (links[i].id == id) {
          links.splice(i, 1, {id, url, description})
          return links[i]
        }
      }


    },

    deleteLink: (_, { id }) => {

      let idCount = links.length

      // Iterate through the array of objects, if it matches then splice / delete it
      for (let i = 0; i < idCount; i++){
        if (links[i].id == id) {
          links.splice(i, 1)
          return links[i]
        }
      }
    }

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