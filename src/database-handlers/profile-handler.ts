import { Types as MongooseTypes } from 'mongoose'
import ProfileModel, { RegisterParameters } from '../models/profile.model'
import bcrypt = require('bcrypt')

const saltRounds = 10

const tryLogin = async (username: string, plainPassword: string) => {
  try {
    const foundProfile = await ProfileModel.findOne({ username }, { password: 1 })

    if (foundProfile === null) {
      return { error: `No profile found with username ${username}`, data: null }
    }

    const isPasswordMatch = await bcrypt.compare(plainPassword, foundProfile.password)
    if (!isPasswordMatch) {
      return { error: `Wrong password`, data: null }
    }

    return { data: { _id: foundProfile._id.toHexString() }, error: null }
  } catch (e) {
    return { error: `MongoDb problem: ${e.message}`, data: null }
  }
}

const tryRegister = async (regObject: RegisterParameters) => {
  try {
    const isAlreadyExistsResponse =
      await ProfileModel.findOne({ $or: [{ username: regObject.username }, { email: regObject.email }] }, { username: 1 })

    if (isAlreadyExistsResponse !== null) {
      const errorMessage =
        isAlreadyExistsResponse.username === regObject.username ?
          `Profile already exists with '${regObject.username}' username` :
          `Profile already exists with '${regObject.email}' email`

      return { error: errorMessage, data: null }
    }

    const hashedPw = await bcrypt.hash(regObject.password, saltRounds)
    const newlyGeneratedId = MongooseTypes.ObjectId()
    regObject.password = hashedPw
    const createdResponse = await ProfileModel.create({
      ...regObject
    })
    return { data: { _id: newlyGeneratedId.toHexString() }, error: null }
  } catch (e) {
    return { error: `MongoDb problem: ${e.message}`, data: null }
  }
}

const getProfileById = async (idString: string) => {
  const id = MongooseTypes.ObjectId(idString)
  const response = await ProfileModel.findById(id, {
    username: 1,
    email: 1,
    data: 1
  })
  return response
}

export default {
  tryLogin,
  tryRegister,
  getProfileById
}
