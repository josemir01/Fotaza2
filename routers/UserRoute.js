import { Router } from 'express'

import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    followUser,
} from '../controllers/Usercontroller.js'

const router = Router()

router.get('/', getUsers)                          
router.get('/:userId', getUserById)                
router.post('/:userId/seguir', followUser)
router.get('/:userId/editar', updateUser)         
router.post('/registro', createUser)              


export default router