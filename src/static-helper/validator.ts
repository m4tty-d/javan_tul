import jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'
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

const handleAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  if (!token) {
    const tokenMissing = { data: null, error: `Missing token` }
    res.status(401).send(tokenMissing)
    return
  }
  const verifiedToken = verifyToken(token)
  if (verifiedToken.error != null) {
    const wrongToken = { data: null, error: verifiedToken.error }
    res.status(401).send(wrongToken)
    return
  }
  req.body.dataFromToken = verifiedToken.data
  next()
}

export default {
  createToken,
  verifyToken,
  handleAuthorization
}
