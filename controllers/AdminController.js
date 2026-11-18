
import { Post } from '../models/Post.js'
import { User } from '../models/User.js'
import { Image } from '../models/Image.js'
import { Report } from '../models/Report.js'

// Mostrar publicaciones pendientes de revisión

export async function getPendingPosts(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    if (req.session.user.rol !== 'ADMIN') {
        return res.status(403).render('error', {
            msg: 'No tenés permisos de administrador'
        })
    }

    try {

        // Publicaciones pendientes de revisión
        const posts = await Post.findAll({
            where: {
                underReview: true,
                estadoPublicacion: 'activa'
            },
            include: [
                {
                    model: User,
                    attributes: ['userid', 'fullName', 'email']
                },
                {
                    model: Image,
                    include: [
                        {
                            model: Report,
                            as: 'ImageReports',
                            where: {
                                type: 'IMAGE',
                                status: 'PENDING'
                            },
                            required: false
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        // Publicaciones bloqueadas
        const blockedPosts = await Post.findAll({
            where: {
                estadoPublicacion: 'bloqueada'
            },
            include: [
                {
                    model: User,
                    attributes: ['userid', 'fullName', 'email']
                },
                {
                    model: Image
                }
            ],
            order: [['updatedAt', 'DESC']]
        })

        return res.render('admin', {
            posts,
            blockedPosts
        })

    } catch (error) {

        console.error('Error al obtener publicaciones:', error)

        return res.status(500).render('error', {
            msg: 'Error al obtener publicaciones'
        })
    }
}


export async function approvePost(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    if (req.session.user.rol !== 'ADMIN') {
        return res.status(403).render('error', {
            msg: 'No tenés permisos de administrador'
        })
    }

    const postId = Number(req.params.postId)

    try {
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        const images = await Image.findAll({
            where: { idPost: postId }
        })

        const imageIds = images.map(img => img.imageid)

        await Report.update(
            { status: 'DISMISSED' },
            {
                where: {
                    idImage: imageIds,
                    type: 'IMAGE',
                    status: 'PENDING'
                }
            }
        )

        await post.update({
            underReview: false,
            estadoPublicacion: 'activa'
        })

        return res.redirect('/admin')

    } catch (error) {
        console.error('Error al aprobar publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al aprobar la publicación'
        })
    }
}



export async function blockPost(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    if (req.session.user.rol !== 'ADMIN') {
        return res.status(403).render('error', {
            msg: 'No tenés permisos de administrador'
        })
    }

    const postId = Number(req.params.postId)

    try {
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        if (post.estadoPublicacion === 'bloqueada') {
            return res.status(400).render('error', {
                msg: 'Esta publicación ya está bloqueada'
            })
        }

        await post.update({
            estadoPublicacion: 'bloqueada',
            underReview: false
        })

        // Contar publicaciones bloqueadas del autor
        const publicacionesBloqueadas = await Post.count({
            where: {
                idUser: post.idUser,
                estadoPublicacion: 'bloqueada'
            }
        })

        // Si tiene 3 o más publicaciones bloqueadas,
        // inactivar automáticamente su cuenta
        if (publicacionesBloqueadas >= 3) {

            await User.update(
                { estadoUsuario: 'inactiva' },
                {
                    where: {
                        userid: post.idUser
                    }
                }
            )
        }

        return res.redirect('/admin')

    } catch (error) {
        console.error('Error al bloquear publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al bloquear la publicación'
        })
    }
}



// Restaurar una publicación bloqueada
export async function restorePost(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    // Solo el administrador puede restaurar
    if (req.session.user.rol !== 'ADMIN') {
        return res.status(403).render('error', {
            msg: 'No tenés permisos de administrador'
        })
    }

    const postId = Number(req.params.postId)

    try {

        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        if (post.estadoPublicacion !== 'bloqueada') {
            return res.status(400).render('error', {
                msg: 'Esta publicación no está bloqueada'
            })
        }

        // Desestimar denuncias pendientes de imágenes
        const images = await Image.findAll({
            where: { idPost: postId }
        })

        const imageIds = images.map(img => img.imageid)

        if (imageIds.length > 0) {
            await Report.update(
                { status: 'DISMISSED' },
                {
                    where: {
                        idImage: imageIds,
                        type: 'IMAGE',
                        status: 'PENDING'
                    }
                }
            )
        }

        // Restaurar publicación
        await post.update({
            estadoPublicacion: 'activa',
            underReview: false
        })

        return res.redirect('/admin')

    } catch (error) {

        console.error('Error al restaurar publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al restaurar la publicación'
        })
    }
}
