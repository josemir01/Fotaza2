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
    updateComment,
    deleteComment,
    searchPostsByHashtag,
    rateImage,
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
router.post('/:postId/imagen/:imageId/comentar', createComment)
router.post('/:postId/imagen/:imageId/comentario/:commentId/editar',updateComment)
router.post('/:postId/imagen/:imageId/comentario/:commentId/eliminar',deleteComment)
router.post('/:postId/imagen/:imageId/rating',rateImage)


//router.post('/:postId/editar', updatePost)
//router.post('/:postId/eliminar', deletePost)


export default router

