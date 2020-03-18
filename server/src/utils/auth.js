import * as jwt from 'jsonwebtoken'

export const auth = {
  authenticate: async (parent, { githubCode }, ctx= Context, info) => {
    // ...

    return {
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET), // <- Sign in
      user
    }
  }
}

// src/utils.ts
import * as jwt from 'jsonwebtoken'

export function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { // <- Verification
      userId: string
    }
    return userId
  }

  throw new AuthError()