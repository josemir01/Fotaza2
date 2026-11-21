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
    CloseImageComments,
    searchPostsByHashtag,
    rateImage,
    searchPosts,
    getFollowingPosts
} from '../controllers/Postcontroller.js'

import { checkPostActive } from '../middlewares/checkPostActive.js'

const router=Router()

router.get('/', getPosts)
router.get('/crear', getCreatePost)
router.post('/crear', createPost)
router.get('/siguiendo', getFollowingPosts)
router.get('/usuario/:userId', getPostsByUserId)
router.get('/buscar', searchPostsByHashtag)
router.get('/buscar-texto', searchPosts)
router.get('/:postId', getPostById)
router.post('/:postId/imagen/:imageId/comentar',checkPostActive, createComment)
router.post('/:postId/imagen/:imageId/comentarios',checkPostActive,CloseImageComments)
router.post('/:postId/imagen/:imageId/comentario/:commentId/editar',checkPostActive,updateComment)
router.post('/:postId/imagen/:imageId/comentario/:commentId/eliminar',checkPostActive,deleteComment)
router.post('/:postId/imagen/:imageId/rating',checkPostActive,rateImage)
router.get('/:postId/editar', checkPostActive,getEditPost)
router.post('/:postId/editar',checkPostActive, updatePost)
router.post('/:postId/eliminar',checkPostActive, deletePost)



export default router

