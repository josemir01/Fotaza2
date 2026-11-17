import { Report } from '../models/Report.js'
import { Comment } from '../models/Comment.js'
import { Post } from '../models/Post.js'
import { Image } from '../models/Image.js'


//denunciar cometario
export async function reportComment(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const commentId = Number(req.params.commentId)
    const userId = req.session.user.userid

    const { reason, description } = req.body

    try {

        if (!reason || !description?.trim()) {
            return res.status(400).render('error', {
                msg: 'Debe seleccionar un motivo y escribir una descripción'
            })
        }

        const comment = await Comment.findByPk(commentId)

        if (!comment) {
            return res.status(404).render('error', {
                msg: 'Comentario no encontrado'
            })
        }

        const post = await Post.findByPk(comment.idPost)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // No permitir denunciar comentarios propios
        if (comment.idUser === userId) {
            return res.status(403).render('error', {
                msg: 'No puede denunciar su propio comentario'
            })
        }

        // Verificar que no haya una denuncia pendiente del mismo usuario
        const existingReport = await Report.findOne({
            where: {
                idUser: userId,
                idComment: commentId,
                type: 'COMMENT',
                status: 'PENDING'
            }
        })

        if (existingReport) {
            return res.status(400).render('error', {
                msg: 'Ya denunció este comentario'
            })
        }

        await Report.create({
            type: 'COMMENT',
            reason,
            description: description.trim(),
            idUser: userId,
            idComment: commentId,
            status: 'PENDING'
        })

        return res.redirect(`/post/${post.postid}`)

    } catch (error) {

        console.error('Error al denunciar comentario:', error)

        return res.status(500).render('error', {
            msg: 'Error al denunciar el comentario'
        })
    }
}


// Denunciar imagen
export async function reportImage(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const imageId = Number(req.params.imageId)
    const userId = req.session.user.userid

    const { reason, description } = req.body

    try {

        // Validar motivo y descripcion
        if (!reason || !description?.trim()) {
            return res.status(400).render('error', {
                msg: 'Debe seleccionar un motivo y escribir una descripcion'
            })
        }

        // Buscar imagen
        const image = await Image.findByPk(imageId)

        if (!image) {
            return res.status(404).render('error', {
                msg: 'Imagen no encontrada'
            })
        }

        // Buscar publicacion a la que pertenece
        const post = await Post.findByPk(image.idPost)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicacion no encontrada'
            })
        }

        // No permitir denunciar imagenes propias
        if (post.idUser === userId) {
            return res.status(403).render('error', {
                msg: 'No puede denunciar su propia imagen'
            })
        }

        // Evitar denuncias duplicadas
        const existingReport = await Report.findOne({
            where: {
                idUser: userId,
                idImage: imageId,
                type: 'IMAGE'
            }
        })

        if (existingReport) {
            return res.status(400).render('error', {
                msg: 'Ya denuncio esta imagen'
            })
        }

        //evitar que se sature de denuncias y hacer la revision mas facil
        if (post.underReview) {
            return res.status(400).render('error', {
                msg: 'Esta publicación ya se encuentra en revisión'
            })
        }

        // Crear denuncia
        await Report.create({
            type: 'IMAGE',
            reason,
            description: description.trim(),
            idUser: userId,
            idImage: imageId,
            status: 'PENDING'
        })

        // Contar denuncias de usuarios distintos
        const reportCount = await Report.count({
            where: {
                idImage: imageId,
                type: 'IMAGE',
                status: 'PENDING'
            },
            distinct: true,
            col: 'idUser'
        })

        // Mas de 3 denuncias: enviar a revision
        if (reportCount > 3) {
            await post.update({
                underReview: true
            })
        }

        return res.redirect(`/post/${post.postid}`)

    } catch (error) {

        console.error('Error al denunciar imagen:', error)

        return res.status(500).render('error', {
            msg: 'Error al denunciar la imagen'
        })
    }
}

//obtener comentarios denunciados de una publicacion
export async function getCommentReports(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const userId = req.session.user.userid

    try {
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Solo el autor puede ver las denuncias
        if (post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para ver estas denuncias'
            })
        }

        // Obtener las imágenes de la publicación
        const images = await Image.findAll({
            where: { idPost: postId }
        })

        const imageIds = images.map(img => img.imageid)

        // Obtener comentarios de esas imágenes
        const comments = await Comment.findAll({
            where: { idImage: imageIds }
        })

        const commentIds = comments.map(comment => comment.Commentid)

        // Obtener denuncias pendientes
        const reports = await Report.findAll({
            where: {
                idComment: commentIds,
                type: 'COMMENT',
                status: 'PENDING'
            },
            order: [['createdAt', 'DESC']]
        })

        // Agrupar las denuncias por comentario
        const comentariosDenunciados = comments
            .map(comment => ({
                comment,
                reports: reports.filter(
                    report => report.idComment === comment.Commentid
                )
            }))
            .filter(item => item.reports.length > 0)

        return res.render('commentReports', {
            post,
            comentariosDenunciados
        })

    } catch (error) {
        console.error('Error al obtener denuncias:', error)

        return res.status(500).render('error', {
            msg: 'Error al obtener las denuncias'
        })
    }
}

//cuando el autor decide que el comentario no debe eliminarse
export async function dismissCommentReport(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const commentId = Number(req.params.commentId)
    const userId = req.session.user.userid

    try {
        const comment = await Comment.findByPk(commentId)

        if (!comment) {
            return res.status(404).render('error', {
                msg: 'Comentario no encontrado'
            })
        }

        const post = await Post.findByPk(comment.idPost)

        if (!post || post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para desestimar estas denuncias'
            })
        }

        await Report.update(
            { status: 'DISMISSED' },
            {
                where: {
                    idComment: commentId,
                    type: 'COMMENT',
                    status: 'PENDING'
                }
            }
        )

        return res.redirect(
            `/denuncias/publicacion/${post.postid}/comentarios`
        )

    } catch (error) {
        console.error('Error al desestimar denuncias:', error)

        return res.status(500).render('error', {
            msg: 'Error al desestimar las denuncias'
        })
    }
}

//cuando el autor decide que el comentario debe eliminarse
export async function deleteReportedComment(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const commentId = Number(req.params.commentId)
    const userId = req.session.user.userid

    try {
        const comment = await Comment.findByPk(commentId)

        if (!comment) {
            return res.status(404).render('error', {
                msg: 'Comentario no encontrado'
            })
        }

        const post = await Post.findByPk(comment.idPost)

        if (!post || post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para eliminar este comentario'
            })
        }

        const denuncia = await Report.findOne({
            where: {
                idComment: commentId,
                type: 'COMMENT',
                status: 'PENDING'
            }
        })

        if (!denuncia) {
            return res.status(400).render('error', {
                msg: 'Este comentario no tiene denuncias pendientes'
            })
        }

        // Resolver las denuncias antes de eliminar
        await Report.update(
            { status: 'RESOLVED' },
            {
                where: {
                    idComment: commentId,
                    type: 'COMMENT',
                    status: 'PENDING'
                }
            }
        )

        await comment.destroy()

        return res.redirect(
            `/denuncias/publicacion/${post.postid}/comentarios`
        )

    } catch (error) {
        console.error('Error al eliminar comentario denunciado:', error)

        return res.status(500).render('error', {
            msg: 'Error al eliminar el comentario denunciado'
        })
    }
}


