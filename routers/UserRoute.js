import { Router } from 'express'

import {
    getUsers,
    createUser,
    getUserById,
} from '../controllers/Usercontroller'

const router = Router()

router.get('/', getUsers)

router.post('/', createUser)

router.post('/', getUserById)

export default router