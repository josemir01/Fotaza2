import { Router } from 'express'
import {
    getLogin,
    loginUser,
    logoutUser
} from '../controllers/AuthController.js'

const router = Router()

router.get('/login', getLogin)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

export default router