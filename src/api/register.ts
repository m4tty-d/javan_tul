import { Router as getExpressRouter } from 'express'
const router = getExpressRouter()
import profileHandler from '../database-handlers/profile-handler'
import tokenHandler from '../static-helper/validator'
import validator = require('validator')
import { RegisterParameters } from '../models/profile.model'

const requiredParams = ['email', 'username', 'password', 'data']

const getMissingParams = (regObject: any) => {
  const missingParams = []
  for (const param of requiredParams) {
    if (regObject[param] === undefined) {
      missingParams.push(param)
    }
  }
  return missingParams
}

const getInvalidParams = (regObject: RegisterParameters) => {
  const problems = []
  if (Object.keys(regObject).length !== 4) {
    problems.push('Parameters that are only allowed:' + requiredParams.join('; '))
  }
  if (!validator.isEmail(regObject.email) || !validator.isLength(regObject.email, { max: 40 })) {
    problems.push('Email must be valid')
  }
  if (!validator.isLength(regObject.password, { min: 3, max: 40 })) {
    problems.push('Password\'s length must be between 3 and 40')
  }
  if (!validator.isAscii(regObject.username) || !validator.isLength(regObject.password, { min: 3, max: 40 })) {
    problems.push('Username must consists of ascii letters and its length must be between 3 and 40')
  }
  return problems
}

const getRequestProblems = (regObject: any) => {
  const missingParams = getMissingParams(regObject)
  if (missingParams.length > 0) {
    return { error: `missing params: ${missingParams.join('; ')}` }
  }
  const invalidParams = getInvalidParams(regObject)
  if (invalidParams.length > 0) {
    return { error: `missing params: ${invalidParams.join('\r\n')}` }
  }
  return null
}

router.post('/', async function (req, res, next) {
  const regObject = req.body
  const requestProblems = getRequestProblems(regObject)

  if (requestProblems !== null) {
    res.status(400).send(requestProblems)
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
