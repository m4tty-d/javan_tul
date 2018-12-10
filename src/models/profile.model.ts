import { Schema, model as mongooseModel, Document, Types } from 'mongoose'

const profileAttributes = {
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }
}

export interface IProfile {
  _id: Types.ObjectId
  username: string
  password: string
  email: string,
  data: any
}

export interface RegisterParameters {
  username: string
  password: string
  email: string
  data: any
}

export interface ProfileDocument extends IProfile, Document {
  _id: IProfile['_id']
  toObject (): IProfile
}

const profileSchema = new Schema({
  ...profileAttributes
})

const profileModel = mongooseModel<ProfileDocument>('Profiles', profileSchema, 'profiles')

export default profileModel
