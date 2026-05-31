import { Router } from 'express'

import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
} from '../controllers/Usercontroller.js'

const router = Router()

router.get('/', getUsers)                          // GET  /usuario
router.get('/:userId', getUserById)                // GET  /usuario/5
router.get('/:userId/editar', updateUser)         // GET  /usuario/5/editar
router.post('/registro', createUser)               // POST /usuario/registro
//router.post('/:userId/editar', updateUser)         // POST /usuario/5/editar

//router.post('/:userId', getUserById)

export default router