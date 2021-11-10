const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

// Find the link by it's ID and delete it

async function deleteLink(parent, args, context, info) {
  const userId = getUserId(context)
  return await context.prisma.link.delete({
    where: { id: args.id, postedBy: { id: userId } },
  })
}

// Find the link by it's ID and update it

async function updateLink(parent, args, context, info) {
  const userId = getUserId(context)
  return await context.prisma.link.update({
    where: { id: args.id, postedBy: { id: userId } },
    data: { description: args.description, url: args.url },
  })
}

// Use prisma client to create a new post

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
}

// Use prisma client to create a new user
// Please see the schema.graphql file for the schema of the user and utils.js for the auth part

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)

  // 2
  const user = await context.prisma.user.create({ data: { ...args, password } })

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4
  return {
    token,
    user,
  }
}

// utils.js contains the auth flow 

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 3
  return {
    token,
    user,
  }
}


// Why do we need to export this? 
// Because we are exporting a function.
// This function will be called by the resolvers.
// The resolvers will call the function and pass in the parent, args, and context
// The function will return the result that we want to return.
// The resolvers will then use the result to resolve the promise.
module.exports = {
  signup,
  login,
  post,
  deleteLink,
  updateLink
}
