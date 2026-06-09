import { Router } from 'express'

import{
    createPost,
    getPosts,
    deletePost,
    getCreatePost,
    getPostById,
    getPostsByUserId,
    getEditPost,
    updatePost,
    createComment,
    searchPostsByHashtag,
    ratePost,
    searchPosts,
} from '../controllers/Postcontroller.js'


const router=Router()

router.get('/', getPosts)
router.get('/crear', getCreatePost)
router.post('/crear', createPost)
router.get('/usuario/:userId', getPostsByUserId)
router.get('/buscar', searchPostsByHashtag)
router.get('/buscar-texto', searchPosts)
router.get('/:postId', getPostById)
//router.get('/:postId/editar', getEditPost)
router.post('/:postId/imagen/:imageId/comentar', createComment)
router.post('/:postId/rating', ratePost)


//router.post('/:postId/editar', updatePost)
//router.post('/:postId/eliminar', deletePost)


export default router

