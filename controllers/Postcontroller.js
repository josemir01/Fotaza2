import { NUMBER } from 'sequelize'
import { Post } from '../models/Post.js'
import { getUserById } from './Usercontroller.js'
import { User } from '../models/User.js'



//////////////////////////////////////////////////////////////////////////////

// GET /post — todas las publicaciones (home o listado)
export async function getPosts(req, res) {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['userid', 'fullName', 'avatar']
            }],
            order: [['createdAt', 'DESC']]
        })
        res.render('post/index', { posts })
    } catch (error) {
        console.error('Error al obtener publicaciones:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones' })
    }
}

// GET /post/:postId — detalle de una publicación
export async function getPostById(req, res) {
    const postId = Number(req.params.postId)
    try {
        const post = await Post.findOne({
            where: { postid: postId },
            include: [{
                model: User,
                attributes: ['userid', 'fullName', 'avatar']
            }]
        })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }
        res.render('post/detail', { post })
    } catch (error) {
        console.error('Error al obtener la publicación:', error)
        res.status(500).render('error', { msg: 'Error interno al obtener la publicación' })
    }
}

// GET /post/usuario/:userId — publicaciones de un usuario específico
export async function getPostsByUserId(req, res) {
    const userId = Number(req.params.userId)
    try {
        // Verificar que el usuario exista
        const user = await User.findOne({
            where: { userid: userId },
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
    // Requiere sesión activa
    if (!req.session.user) {
        return res.redirect('/login')
    }
    res.render('post/create')
}

// POST /post/crear — guardar nueva publicación
export async function createPost(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    try {
        const { description } = req.body
        const userId = req.session.user.userid

        const post = await Post.create({
            description: description || null,
            UserId: userId       // FK generada automáticamente por Sequelize con User.hasMany(Post)
        })

        res.redirect(`/post/${post.postid}`)
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
