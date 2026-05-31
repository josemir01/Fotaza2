// import { Post } from '../models/Post.js'
// import { getUserById } from './Usercontroller.js'
// import { User } from '../models/User.js'
// import { Image } from '../models/image.js'
// import { Comment } from '../models/Comment.js'

import { Hashtag } from '../models/Hashtag.js'
import { User, Post, Image, Comment } from '../models/index.js'


//Hashtags
async function fetchAllHashtags() {
    return await Hashtag.findAll({ order: [['name', 'ASC']] })
}

// GET /post/hashtag/:hashtagId
export async function getPostsByHashtag(req, res) {
    const hashtagId = Number(req.params.hashtagId)
    try {
        const tag = await Hashtag.findByPk(hashtagId, {
            include: [{
                model: Post,
                through: { attributes: [] },
                include: [{ model: User, attributes: ['userid', 'fullName', 'avatar'] }]
            }]
        })
        if (!tag) return res.status(404).render('error', { msg: 'Hashtag no encontrado' })
        res.render('post/byHashtag', { tag, posts: tag.Posts })
    } catch (error) {
        console.error('Error al obtener publicaciones por hashtag:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones con ese tag' })
    }
}
//////////////////////////////////////////////////////////////////////////////

//Comment

export async function createComment(req, res) {
    try {
        const { content } = req.body
        const postId = Number(req.params.postId)
        const imageId = Number(req.params.imageId)

        const userId = 1 // temporal

        await Comment.create({
            content,
            idUser: userId,
            idPost: postId,
            idImage: imageId
        })

        res.redirect(`/post/${postId}`)

    } catch (error) {
        console.error('Error al crear un comentario:', error)
        res.status(500).render('error', { msg: 'Error al crear un comentario' })
    }
}



////////////////////////////////////////////////////////////////////////////////

//Post

// GET /post — todas las publicaciones (home o listado)
export async function getPosts(req, res) {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Image,
                    as: 'Images',
                },
                {
                    model: Hashtag
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        res.render('post', { posts })
    } catch (error) {
        console.error('Error al obtener publicaciones:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones' })
    }
}

// GET /post/:postId — detalle de una publicación
export async function getPostById(req, res) {
    const postId = Number(req.params.postId)
    try {
        const post = await Post.findByPk(postId, {
            include: [
                {
                    model: User,
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Image,
                    as: 'Images',
                    include: [
                        {
                            model: Comment,
                            as: 'Comments',
                            include: [
                                {
                                    model: User,
                                    as: 'User',
                                    attributes: ['userid', 'fullName']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Hashtag,
                    through: { attributes: [] }
                }
            ]
        })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }
        res.render('show', { post })
    } catch (error) {
        console.error('ERROR COMPLETO:', error)
        res.status(500).render('error', { msg: 'Error interno al obtener la publicación' })
    }
}

// GET /post/usuario/:userId — publicaciones de un usuario específico
export async function getPostsByUserId(req, res) {
    const userId = Number(req.params.userId)
    try {
        // Verificar que el usuario exista
        const user = await User.findOne({
            where: { idUser: userId },
            attributes: { exclude: ['password'] }
        })
        if (!user) {
            return res.status(404).render('user/error', { msg: 'Usuario no encontrado' })
        }

        const posts = await Post.findAll({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']]
        })

        res.render('post/userPosts', { posts, user })
    } catch (error) {
        console.error('Error al obtener publicaciones del usuario:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones del usuario' })
    }
}

// GET /post/crear — mostrar formulario de creación
export async function getCreatePost(req, res) {
    try {
        // Requiere sesión activa
        // if (!req.session.user) {
        //     return res.redirect('/login')
        // }
        const allTags = await fetchAllHashtags()
        res.render('create', { allTags })

    } catch (error) {
        console.error('Error al cargar formulario:', error)
        res.status(500).render('error', { msg: 'Error al cargar formulario' })
    }
}

// POST /post/crear — guardar nueva publicación
export async function createPost(req, res) {
    // if (!req.session.user) {
    //     return res.redirect('/login')
    // }
    try {
        const { description, titulo, imagenBase64, opciones } = req.body
        //const userId = req.session.user.userid
        const userId = 1             //cambiar a futuro de momento solo prueba

        //crear el post
        const post = await Post.create({
            title: titulo,
            description: description || null,
            idUser: userId       // FK generada automáticamente por Sequelize con User.hasMany(Post)
        })

        //recibo las imagenes en base 64 del body
        if (imagenBase64) {
            await Image.create({
                image: imagenBase64,
                copyright: false, //debo cambiar a futuro, de momento solo prueba
                idPost: post.postid,
            })
        }
        
        if (opciones) {
            await post.addHashtags(opciones)
        }
        res.redirect('/post')
    } catch (error) {
        console.error('Error al crear la publicación:', error)
        res.status(500).render('error', { msg: 'Error al crear la publicación' })
    }
}

// GET /post/:postId/editar — mostrar formulario de edición
export async function getEditPost(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    const postId = Number(req.params.postId)
    try {
        const post = await Post.findOne({ where: { postid: postId } })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }
        // Solo el autor puede editar
        if (post.UserId !== req.session.user.userid) {
            return res.status(403).render('error', { msg: 'No tenés permiso para editar esta publicación' })
        }
        res.render('post/edit', { post })
    } catch (error) {
        console.error('Error al obtener la publicación para edición:', error)
        res.status(500).render('error', { msg: 'Error interno' })
    }
}

// POST /post/:postId/editar — guardar cambios de la publicación
export async function updatePost(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    const postId = Number(req.params.postId)
    try {
        const post = await Post.findOne({ where: { postid: postId } })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }
        if (post.UserId !== req.session.user.userid) {
            return res.status(403).render('error', { msg: 'No tenés permiso para editar esta publicación' })
        }

        const { description } = req.body
        await post.update({ description: description || null })

        res.redirect(`/post/${postId}`)
    } catch (error) {
        console.error('Error al actualizar la publicación:', error)
        res.status(500).render('error', { msg: 'Error al actualizar la publicación' })
    }
}

// POST /post/:postId/eliminar — eliminar una publicación
export async function deletePost(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    const postId = Number(req.params.postId)
    try {
        const post = await Post.findOne({ where: { postid: postId } })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }
        if (post.UserId !== req.session.user.userid) {
            return res.status(403).render('error', { msg: 'No tenés permiso para eliminar esta publicación' })
        }

        await post.destroy()
        res.redirect(`/usuario/${req.session.user.userid}`)
    } catch (error) {
        console.error('Error al eliminar la publicación:', error)
        res.status(500).render('error', { msg: 'Error al eliminar la publicación' })
    }
}
