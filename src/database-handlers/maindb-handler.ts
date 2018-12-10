import { connect } from 'mongoose'
const connectToDb = async () => {
  connect((process.env.MONGODB_ADDRESS as string), {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PW,
    useNewUrlParser: true
  })
}

export default {
  connectToDb
}
