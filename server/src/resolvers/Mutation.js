import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";
import { authorizeWithGithub } from "../utils/lib";

const Mutation = {
  // async createUser(parent, args, { prisma }, info) {
  //   const password = await hashPassword(args.data.password);
  //   const user = await prisma.mutation.createUser({
  //     data: {
  //       ...args.data,
  //       password
  //     }
  //   });

  //   return {
  //     user,
  //     token: generateToken(user.id)
  //   };
  // },
  // async login(parent, args, { prisma }, info) {
  //   const user = await prisma.query.user({
  //     where: {
  //       email: args.data.email
  //     }
  //   });

  //   if (!user) {
  //     throw new Error("Unable to login");
  //   }

  //   const isMatch = await bcrypt.compare(args.data.password, user.password);

  //   if (!isMatch) {
  //     throw new Error("Unable to login");
  //   }

  //   return {
  //     user,
  //     token: generateToken(user.id)
  //   };
  // },
  // async deleteUser(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request);

  //   return prisma.mutation.deleteUser(
  //     {
  //       where: {
  //         id: userId
  //       }
  //     },
  //     info
  //   );
  // },
  // async updateUser(parent, args, { prisma, request }, info) {
  //   const userId = getUserId(request);

  //   if (typeof args.data.password === "string") {
  //     args.data.password = await hashPassword(args.data.password);
  //   }

  //   return prisma.mutation.updateUser(
  //     {
  //       where: {
  //         id: userId
  //       },
  //       data: args.data
  //     },
  //     info
  //   );
  // },
  async githubAuth(parent, { code }, context) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    });

    if (message) {
      throw new Error(message);
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };

    const user = await context.prisma.upsertUser({
      where: {
        githubToken: access_token
      },
      update: {
        name,
        githubToken: access_token,
        avatar: avatar_url
      },
      create: {
        ...latestUserInfo
      }
    });
    return { user, token: access_token };
  }
};

export { Mutation as default };
