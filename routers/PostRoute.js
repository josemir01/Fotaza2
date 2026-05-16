import { Router } from 'express'

import{
    createPost,
    getPosts,
    getPostsById,
} from '../controllers/Postcontroller'


const router=Router()

router.get('/:idPost', getPostsById)
router.get('/usuario/:idUser', getPostsByUserId)

export default router

