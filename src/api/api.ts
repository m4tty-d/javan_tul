import { Router as getExpressRouter } from 'express'
import validator from '../static-helper/validator'
const router = getExpressRouter()
import loginRoute from './login'
import registerRoute from './register'
import profileHandler from '../database-handlers/profile-handler'

import { IProfile } from '../models/profile.model'

router.use('/login', loginRoute)
router.use('/register', registerRoute)

router.use(validator.handleAuthorization)

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
