import { Router } from 'express'
import {
    getLogin,
    loginUser,
    logoutUser,
    getRegister,
    createUser
} from '../controllers/AuthController.js'

const router = Router()

router.get('/login', getLogin)
router.post('/login', loginUser)
router.get('/registro', getRegister)
router.post('/registro', createUser)
router.get('/logout', logoutUser)

export default router