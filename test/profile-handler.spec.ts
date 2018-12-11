import { assert } from 'chai'
import profileHandler from '../src/database-handlers/profile-handler'
import mainDb from '../src/database-handlers/maindb-handler'
import { config as environmentConfig } from 'dotenv'

describe('profile-handler - login', () => {

  before(async () => {
    environmentConfig()
    await mainDb.connectToDb()
  })

  it('mongo call should return with no error', async () => {
    const response = await profileHandler.tryLogin('asd','asd')
    assert.isNull(response.error)
    assert.isNotNull(response.data)
  })

  it('mongo call should return with error', async () => {
    const response = await profileHandler.tryLogin('asd2','asd2')
    assert.isString(response.error)
    assert.isNull(response.data)
  })
})
