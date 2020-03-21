import jwt from "jsonwebtoken";

const getUserId = async (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const githubToken = request.headers.authorization.split(" ")[1];
    return githubToken;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }

  return null;
};

export { getUserId as default };
