import { config as environmentConfig } from 'dotenv'
environmentConfig()
import maindbHandler from './database-handlers/maindb-handler'
import apiHandler from './api/api'
import jwtHandler from './static-helper/token-handler'

maindbHandler.connectToDb()

import express, { NextFunction, Response, Request } from 'express'
const app = express()
const port = 3000

// TODO:
// - REFACTOR
// - paraméterek vizsgálata

app.use(express.json())
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.log('Invalid Request data')
    res.status(400).send({ error: `${err.name}: ${err.message}` })
  } else {
    next()
  }
})

app.use('/api', apiHandler)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
