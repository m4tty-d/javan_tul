import jwt = require('jsonwebtoken')
const secret: string = process.env.JWT as string

const createToken = (data: any) => {
  const createdToken = jwt.sign({
    data
  }, secret, {
    audience: 'user',
    expiresIn: '6h',
    issuer: 'server'
  })
  return createdToken
}

const verifyToken = (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret)
    return { data: verifiedToken, error: null }
  } catch (e) {
    const decodedToken = jwt.decode(token)
    return { data: decodedToken, error: e.message as string }
  }
}

export default {
  createToken,
  verifyToken,
  secret
}
