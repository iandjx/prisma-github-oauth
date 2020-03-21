import jwt from "jsonwebtoken";
require("es6-promise").polyfill();
require("isomorphic-fetch");

export const getPrismaUser = async (db, githubUserId) => {
  githubUserId = githubUserId + "";
  return await db.query.user({ where: { githubUserId } });
};

export const createPrismaUser = async (db, githubUser) => {
  const user = await db.mutation.createUser({
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

export async function getGithubToken(githubCode) {
  const endpoint = "https://github.com/login/oauth/access_token";

  const data = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: githubCode
    })
  }).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data.access_token;
}

export async function getGithubUser(githubToken) {
  const endpoint = `https://api.github.com/user?access_token=${githubToken}`;
  const data = await fetch(endpoint).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data;
}

export function getUserId(request) {
  const Authorization = request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return userId;
  }
}
