
import { Post } from '../models/Post.js'

// Verificar que la publicación esté activa
export async function checkPostActive(req, res, next) {

    const postId = Number(req.params.postId)

    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).render('error', {
            msg: 'Identificador de publicación inválido'
        })
    }

    try {

        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Impedir operaciones sobre publicaciones bloqueadas
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'Esta publicación está bloqueada y no puede modificarse'
            })
        }

        next()

    } catch (error) {

        console.error('Error al verificar publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al verificar el estado de la publicación'
        })
    }
}
