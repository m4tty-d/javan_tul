import { Router as getExpressRouter } from 'express'
const router = getExpressRouter()
import profileHandler from '../database-handlers/profile-handler'
import tokenHandler from '../static-helper/token-handler'

import { RegisterParameters } from '../models/profile.model'

const getMissingParams = (regObject: any) => {
  const requiredParams = ['email', 'username', 'password', 'data']
  const missingParams = []
  for (const param of requiredParams) {
    if (regObject[param] === undefined) {
      missingParams.push(param)
    }
  }
  return missingParams
}

// __TODO__ optional params --> hogy bullshit-et ne lehessen beleírni
// ötlet: kéne szabályozni a max méretét is a cuccosoknak
// pl 5000 karakteres username ne legyen már
router.post('/', async function (req, res, next) {
  const regObject = req.body
  const missingParams = getMissingParams(regObject)
  if (missingParams.length > 0) {
    res.status(400).send({ error: `missing params: ${missingParams.join('; ')}` })
    return
  }
  const profile = await profileHandler.tryRegister(regObject)
  if (profile.data === null) {
    res.status(400).send({ error: profile.error })
    return
  }
  const token = tokenHandler.createToken(profile.data)
  res.status(200).send({
    token,
    profileId: profile.data._id
  })
})

export default router
