import { Router } from 'express'

import {
    getUsers,
    getUserById,
    updateUser,
    followUser,
    getEditUser,
    unfollowUser,
    searchUsers
} from '../controllers/Usercontroller.js'

const router = Router()

router.get('/', getUsers)
router.get('/buscar', searchUsers)                          
router.get('/:userId', getUserById)
router.get('/:userId/editar', getEditUser)
router.post('/:userId/editar', updateUser)                
router.post('/:userId/seguir', followUser)
router.post('/:userId/dejarDeseguir', unfollowUser)                           


export default router