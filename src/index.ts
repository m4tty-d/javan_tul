import { config as environmentConfig } from 'dotenv'
environmentConfig()
import maindbHandler from './database-handlers/maindb-handler'
import apiHandler from './api/api'

maindbHandler.connectToDb()

import express, { NextFunction, Response, Request } from 'express'
const app = express()
const appPort = parseInt(process.env.APP_PORT as string, 10) || 3000
import cors = require('cors')

const handleJsonErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.log('Invalid Request data')
    res.status(400).send({ error: `${err.name}: ${err.message}` })
  } else {
    next()
  }
}

// TODO:
// - REFACTOR

app.use(cors())
app.use(express.json())
app.use(handleJsonErrors)

app.use('/api', apiHandler)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(appPort, () => console.log(`Example app listening on port ${appPort}!`))
