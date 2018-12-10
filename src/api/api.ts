import { Router as getExpressRouter } from 'express'
const router = getExpressRouter()
import loginRoute from './login'
import registerRoute from './register'
import profileHandler from '../database-handlers/profile-handler'
import tokenHandler from '../static-helper/token-handler'

import { IProfile } from '../models/profile.model'
router.use('/login', loginRoute)
router.use('/register', registerRoute)

router.use(async (req, res, next) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  if (!token) {
    const tokenMissing = { data: null, error: `Missing token` }
    res.status(400).send(tokenMissing)
    return
  }
  const verifiedToken = tokenHandler.verifyToken(token)
  if (verifiedToken.error != null) {
    const wrongToken = { data: null, error: verifiedToken.error }
    res.status(400).send(wrongToken)
    return
  }
  req.body.dataFromToken = verifiedToken.data
  next()
})

router.get('/myProfile', async (req, res, next) => {
  const profileId: string = req.body.dataFromToken.data._id
  const profile = await profileHandler.getProfileById(profileId)
  const response: {data: IProfile | null, error: null | string} = { data: null, error: null }

  if (!profile) {
    response.error = `Profile not found`
    res.status(404)
  } else {
    response.data = profile.toObject()
  }

  res.send(response)
})

export default router
