import { Router } from 'express'

import{
    createPost,
    getPosts,
    getPostsById,
} from '../controllers/Postcontroller'


const router=Router()

router.get('/', getPosts)                              // GET  /post
router.get('/crear', getCreatePost)                    // GET  /post/crear  (antes que /:postId)
router.get('/usuario/:userId', getPostsByUserId)       // GET  /post/usuario/5
router.get('/:postId', getPostById)                    // GET  /post/3
router.get('/:postId/editar', getEditPost)             // GET  /post/3/editar
router.post('/crear', createPost)                      // POST /post/crear
router.post('/:postId/editar', updatePost)             // POST /post/3/editar
router.post('/:postId/eliminar', deletePost)           // POST /post/3/eliminar

router.get('/:idPost', getPostsById)
router.get('/usuario/:idUser', getPostsByUserId)

export default router

