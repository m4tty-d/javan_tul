import profileHandler from '../database-handlers/profile-handler'
import { IProfile } from '../models/profile.model'
import { Router as getExpressRouter } from 'express'
const router = getExpressRouter()

router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
  const profileId: string = req.body.dataFromToken.data._id
  const data: any = req.body.data
  if (!data) {
    res.status(400).send({ error: 'No data provided', data: null })
  }

  try {
    await profileHandler.changeDataForProfile(profileId, data)
    res.send({ error: null, data: { changedAt: new Date() } })
  } catch (e) {
    res.status(500).send({ error: 'db problem:' + e.message, data: null })
  }
})

export default router
