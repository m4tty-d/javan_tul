import { Router as getExpressRouter } from 'express'
import validator from '../static-helper/validator'
const router = getExpressRouter()
import loginRoute from './login'
import registerRoute from './register'
import myProfileRoute from './my-profile'

router.use('/login', loginRoute)
router.use('/register', registerRoute)

router.use(validator.handleAuthorization)
router.use('/myProfile', myProfileRoute)

export default router
