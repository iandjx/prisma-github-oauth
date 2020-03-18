export const getPrismaUser = async (ctx, githubUserId) => {
  return await ctx.query.user({ where: { githubUserId } });
};

export const createPrismaUser = async (ctx, githubUser) => {
  const user = await ctx.mutation.createUser({
    data: {
      githubUserId: githubUser.id,
      name: githubUser.name,
      bio: githubUser.bio,
      public_repos: githubUser.public_repos,
      public_gists: githubUser.public_gists,
      notes: []
    }
  });
  return user;
};
