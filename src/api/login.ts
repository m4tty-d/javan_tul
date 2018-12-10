import { Router as getExpressRouter } from 'express'
const router = getExpressRouter()
import profileHandler from '../database-handlers/profile-handler'
import tokenHandler from '../static-helper/token-handler'

router.post('/', async function (req, res, next) {
  let username: string = req.body.username
  username = username || req.body.usernameOrEmail
  const password: string = req.body.password
  if (username == null || password == null) {
    res.status(400).send({ error: 'username or password missing' })
    return
  }
  const profile = await profileHandler.tryLogin(username, password)
  // if (profile.error !== null) {
  if (profile.data === null) {
    res.status(401).send({ error: profile.error })
    return
  }
  const token = tokenHandler.createToken(profile.data)
  res.send({
    token,
    profileId: profile.data._id
  })
})

export default router
