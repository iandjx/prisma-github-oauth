import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    });
  },
  githubLoginUrl: () => {
    return `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`;
  },
  feed: (parent, args, { prisma }) => {
    return prisma.posts({ where: { published: true } });
  },
  drafts: (parent, args, { prisma }) => {
    return prisma.posts({ where: { published: false } });
  },
  post: (parent, { id }, { prisma }) => {
    return prisma.post({ id });
  }
};

export { Query as default };
