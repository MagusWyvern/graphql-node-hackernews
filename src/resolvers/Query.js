function feed(parent, args, context, info) {
    return context.prisma.link.findMany()
  }
  


function info() {
  return "This is the API of a Hackernews Clone";
}

function link(parent, args, context, info) {
    const oneLink = context.prisma.link.findUnique({
        where: {
          id: parseInt(args.id),
        },
      })
      return oneLink
}

module.exports = {
    feed,
    info,
    link,
}