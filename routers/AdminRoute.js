
import { Router } from 'express'

import {
    getPendingPosts,
    approvePost,
    blockPost,
    restorePost
} from '../controllers/AdminController.js'

const router = Router()

router.get('/', getPendingPosts)
router.post('/:postId/aprobar', approvePost)
router.post('/:postId/bloquear', blockPost)
router.post('/:postId/restaurar',restorePost)

export default router
