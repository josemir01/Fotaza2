// import { Post } from '../models/Post.js'
// import { getUserById } from './Usercontroller.js'
// import { User } from '../models/User.js'
// import { Image } from '../models/image.js'
// import { Comment } from '../models/Comment.js'
import { Rating } from '../models/Rating.js'
import { Hashtag } from '../models/Hashtag.js'
import { User, Post, Image, Comment } from '../models/index.js'
import { Report } from '../models/Report.js'
import { Follow } from '../models/Follow.js'
import sharp from 'sharp'
import { Op } from 'sequelize'


//verificar si la publicacion tiene denuncias
async function postTieneDenuncias(postId) {

    // Buscar todas las imagenes de la publicacion
    const imagenes = await Image.findAll({
        where: {
            idPost: postId
        },
        attributes: ['imageid']
    })

    const imageIds = imagenes.map(img => img.imageid)

    if (imageIds.length === 0) {
        return false
    }

    // Verificar si alguna imagen tiene denuncias pendientes
    const denuncia = await Report.findOne({
        where: {
            idImage: {
                [Op.in]: imageIds
            },
            type: 'IMAGE',
            status: 'PENDING'
        }
    })

    return denuncia !== null
}

//Hashtags
async function fetchAllHashtags() {
    return await Hashtag.findAll({
        order: [['name', 'ASC']]
    })
}

// GET /post/hashtag/:hashtagId
export async function searchPostsByHashtag(req, res) {
    const hashtagId = Number(req.query.hashtagId)

    if (!hashtagId) {
        return res.redirect('/post')
    }

    try {
        const tag = await Hashtag.findByPk(hashtagId, {
            include: [{
                model: Post,
                through: { attributes: [] },
                where: {
                    estadoPublicacion: 'activa'
                },
                required: false,
                include: [
                    {
                        model: User,
                        attributes: ['userid', 'fullName', 'avatar']
                    },
                    {
                        model: Image,
                        as: 'Images',
                        where: req.session.user ? {} : { copyright: false },
                        required: false,
                        include: [
                            {
                                model: Rating
                            }
                        ]
                    },
                    {
                        model: Hashtag
                    }
                ]
            }]
        })

        const allTags = await fetchAllHashtags()

        // Si no existe el hashtag
        if (!tag) {
            return res.render('post', {
                posts: [],
                allTags,
                msg: 'Hashtag no encontrado'
            })
        }

        // Filtrar publicaciones con imágenes visibles
        const postsVisibles = (tag.Posts || []).filter(
            post => post.Images.length > 0
        )

        // Si no tiene publicaciones visibles
        if (postsVisibles.length === 0) {
            return res.render('post', {
                posts: [],
                allTags,
                msg: 'No se encontraron publicaciones'
            })
        }

        // Mostrar publicaciones
        res.render('post', {
            posts: postsVisibles,
            allTags
        })

    } catch (error) {
        console.error('Error al obtener publicaciones por hashtag:', error)

        res.status(500).render('error', {
            msg: 'Error al obtener las publicaciones con ese tag'
        })
    }
}

//////////////////////////////////////////////////////////////////////////////

// Comment

export async function createComment(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    try {
        const { content } = req.body
        const postId = Number(req.params.postId)
        const imageId = Number(req.params.imageId)

        const userId = req.session.user.userid

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés comentar porque esta publicación está bloqueada'
            })
        }

        // Buscar la imagen
        const image = await Image.findByPk(imageId)

        if (!image) {
            return res.status(404).render('error', {
                msg: 'Imagen no encontrada'
            })
        }

        // Verificar que la imagen pertenezca a la publicación
        if (image.idPost !== postId) {
            return res.status(400).render('error', {
                msg: 'La imagen no pertenece a esta publicación'
            })
        }

        // Verificar si los comentarios están cerrados
        if (image.comentDisable) {
            return res.status(403).render('error', {
                msg: 'Los comentarios están cerrados para esta imagen'
            })
        }

        // Validar contenido
        if (!content || !content.trim()) {
            return res.redirect(`/post/${postId}`)
        }

        // Crear comentario
        await Comment.create({
            content: content.trim(),
            idUser: userId,
            idPost: postId,
            idImage: imageId
        })

        return res.redirect(`/post/${postId}`)

    } catch (error) {
        console.error('Error al crear un comentario:', error)

        return res.status(500).render('error', {
            msg: 'Error al crear un comentario'
        })
    }
}


////////////////////////////////////////////////////////////////////////////////


// Rating


export async function rateImage(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const imageId = Number(req.params.imageId)
    const userId = req.session.user.userid
    const value = Number(req.body.value)

    try {

        // Validar valoración de 1 a 5
        if (!Number.isInteger(value) || value < 1 || value > 5) {
            return res.status(400).render('error', {
                msg: 'La valoración debe ser entre 1 y 5'
            })
        }

        // Buscar imagen y publicación
        const image = await Image.findByPk(imageId, {
            include: [{ model: Post }]
        })

        if (!image) {
            return res.status(404).render('error', {
                msg: 'Imagen no encontrada'
            })
        }

        // Verificar que pertenezca a la publicación
        if (image.idPost !== postId) {
            return res.status(400).render('error', {
                msg: 'La imagen no pertenece a esta publicación'
            })
        }

        // No permitir valorar publicaciones bloqueadas
        if (image.Post.estadoPublicacion === 'bloqueada') {
            return res.status(403).render('error', {
                msg: 'No podés valorar una publicación bloqueada'
            })
        }

        // El autor no puede valorar sus propias imágenes
        if (image.Post.idUser === userId) {
            return res.status(403).render('error', {
                msg: 'No podés valorar tus propias imágenes'
            })
        }

        // Verificar si ya existe una valoración
        const ratingExistente = await Rating.findOne({
            where: {
                idUser: userId,
                idImage: imageId
            }
        })

        if (ratingExistente) {
            return res.status(403).render('error', {
                msg: 'Ya valoraste esta imagen'
            })
        }

        // Crear valoración
        await Rating.create({
            value,
            idUser: userId,
            idImage: imageId
        })

        return res.redirect(`/post/${postId}`)

    } catch (error) {
        console.error('Error al valorar la imagen:', error)

        return res.status(500).render('error', {
            msg: 'Error al valorar la imagen'
        })
    }
}



////////////////////////////////////////////////////////////////////////////////

//Post

// GET /post — todas las publicaciones (home o listado)
export async function getPosts(req, res) {
    try {
        const posts = await Post.findAll({
            where: {
                estadoPublicacion: 'activa'
            },
            include: [
                {
                    model: User,
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Image,
                    as: 'Images',
                    where: req.session.user ? {} : { copyright: false },
                    required: false,
                    include: [{
                        model: Rating
                    }]
                },
                {
                    model: Hashtag
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        let usuariosSeguidos = []

        if (req.session.user) {
            const seguidos = await Follow.findAll({
                where: {
                    followerId: req.session.user.userid
                }
            })

            usuariosSeguidos = seguidos.map(
                seguido => seguido.followingId
            )
        }

        const postsVisibles = posts.filter(post => post.Images.length > 0)

        // Calcular promedio de cada publicación
        for (const post of postsVisibles) {

            let mejorPromedio = 0
            let esDestacada = false

            for (const img of post.Images || []) {

                const ratings = img.Ratings || []

                if (ratings.length > 0) {

                    let suma = 0

                    for (const rating of ratings) {
                        suma = suma + rating.value
                    }

                    const promedio = suma / ratings.length

                    if (promedio > mejorPromedio) {
                        mejorPromedio = promedio
                    }
                    if (ratings.length >= 3 && promedio > 4) {
                        esDestacada = true
                    }
                }
            }

            post.mejorPromedio = mejorPromedio
            post.esDestacada = esDestacada
        }

        // Priorizar publicaciones con promedio > 4 y mínimo 3 votos
        postsVisibles.sort((a, b) => {
            const destacadaA = a.esDestacada
            const destacadaB = b.esDestacada

            if (destacadaA !== destacadaB) {
                if (destacadaA) {
                    return -1
                } else {
                    return 1
                }
            }

            return 0
        })


        const allTags = await fetchAllHashtags()
        console.log(allTags)
        res.render('post', { posts, allTags, usuariosSeguidos })
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
                    where: req.session.user ? {} : { copyright: false },
                    required: false,

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
                        },
                        {
                            model: Rating
                        }
                    ]
                },
                {
                    model: Hashtag,
                    through: { attributes: [] }
                },

            ]
        })
        if (!post) {
            return res.status(404).render('post/error', { msg: 'Publicación no encontrada' })
        }

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion === 'bloqueada') {
            return res.status(403).render('error', {
                msg: 'Esta publicación fue bloqueada por un administrador'
            })
        }

        // Verificar imágenes públicas para usuarios anónimos
        if (!req.session.user && post.Images.length === 0) {
            return res.status(403).render('error', {
                msg: 'Esta publicación no tiene imágenes públicas disponibles'
            })
        }


        //sacar el promedio de valoraciones
        //obtiene todas las valoraciones
        for (const img of post.Images || []) {
            const ratings = img.Ratings || []
            // Cantidad total de valoraciones
            img.cantidadRatings = ratings.length
            let promedioRating = 0
            if (ratings.length > 0) {
                let suma = 0
                for (const rating of ratings) {
                    suma = suma + Number(rating.value)
                }
                promedioRating = (suma / ratings.length).toFixed(1)
            }
            img.promedioRating = promedioRating

            // Verificar si el usuario conectado ya valoró
            img.yaValoro = req.session.user ? ratings.some(rating => rating.idUser === req.session.user.userid) : false
        }

        // Verificar denuncias pendientes
        const tieneDenuncias = await postTieneDenuncias(postId)
        res.render('show', { post, tieneDenuncias })
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
            where: {
                idUser: userId,
                estadoPublicacion: 'activa'
            },
            include: [
                {
                    model: Image,
                    as: 'Images',
                    where: req.session.user ? {} : { copyright: false },
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        // Mostrar publicaciones con imágenes visibles
        const postsVisibles = posts.filter(post => post.Images.length > 0)

        res.render('post/userPosts', { posts: postsVisibles, user })
    } catch (error) {
        console.error('Error al obtener publicaciones del usuario:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones del usuario' })
    }
}

// GET /post/crear — mostrar formulario de creación
export async function getCreatePost(req, res) {
    try {
        //Requiere sesión activa
        if (!req.session.user) {
            return res.redirect('/login')
        }
        const allTags = await fetchAllHashtags()
        res.render('create', { allTags })

    } catch (error) {
        console.error('Error al cargar formulario:', error)
        res.status(500).render('error', { msg: 'Error al cargar formulario' })
    }
}


export async function createPost(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    try {
        const { descripcion, titulo, imagenBase64, opciones } = req.body
        const userId = req.session.user.userid

        // Recibir las imágenes con sus configuraciones
        const imagenesArray = JSON.parse(imagenBase64 || '[]')

        if (!Array.isArray(imagenesArray) || imagenesArray.length === 0) {
            return res.status(400).render('error', {
                msg: 'Debés seleccionar al menos una imagen'
            })
        }

        // Crear la publicación
        const post = await Post.create({
            title: titulo,
            description: descripcion || null,
            idUser: userId
        })

        // Recorrer las imágenes
        for (const img of imagenesArray) {

            let imagenFinal = img.image

            const copyright = img.copyright === true
            const watermark = copyright && img.watermark === true
            const watermarkText = watermark
                ? String(img.watermarkText || '').trim()
                : ''

            if (watermark) {

                if (!watermarkText) {
                    throw new Error('La marca de agua necesita un texto')
                }

                // Separar el encabezado Base64
                const base64 = img.image.split(',')[1]

                // Convertir Base64 a Buffer
                const buffer = Buffer.from(base64, 'base64')

                // Obtener dimensiones de la imagen
                const metadata = await sharp(buffer).metadata()

                const ancho = metadata.width
                const alto = metadata.height

                // Crear el texto de la marca de agua
                const textoSeguro = watermarkText
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;')

                const tamañoFuente = Math.max(
                    16,
                    Math.min(48, Math.floor(ancho / 15))
                )

                const svg = `
                    <svg width="${ancho}" height="${alto}">
                        <text
                            x="50%"
                            y="50%"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            font-family="Arial"
                            font-size="${tamañoFuente}"
                            fill="white"
                            fill-opacity="0.5"
                        >${textoSeguro}</text>
                    </svg>
                `

                // Incorporar la marca de agua
                const imagenProcesada = await sharp(buffer)
                    .rotate()
                    .composite([
                        {
                            input: Buffer.from(svg),
                            gravity: 'center'
                        }
                    ])
                    .png()
                    .toBuffer()

                // Convertir nuevamente a Base64
                imagenFinal = 'data:image/png;base64,' +
                    imagenProcesada.toString('base64')
            }

            // Guardar imagen
            await Image.create({
                image: imagenFinal,
                copyright: copyright,
                watermark: watermark,
                watermarkText: watermark ? watermarkText : null,
                idPost: post.postid
            })
        }

        // Guardar hashtags
        if (opciones) {
            await post.addHashtags(opciones)
        }

        res.redirect('/post')

    } catch (error) {
        console.error('Error al crear la publicación:', error)

        res.status(500).render('error', {
            msg: 'Error al crear la publicación'
        })
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

        console.log('Autor de la publicación:', post.idUser)
        console.log('Usuario conectado:', req.session.user.userid)

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés editar una publicación bloqueada por un administrador'
            })
        }

        // Solo el autor puede editar
        const esAutor = post.idUser === req.session.user.userid
        if (!esAutor) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para editar esta publicación'
            })
        }

        // Verificar si la publicación tiene denuncias
        const tieneDenuncias = await postTieneDenuncias(postId)

        if (tieneDenuncias) {
            return res.status(403).render('error', {
                msg: 'No podés editar esta publicación porque tiene denuncias pendientes'
            })
        }

        res.render('edit', { post })
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
    const userId = req.session.user.userid

    try {

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés editar una publicación bloqueada por un administrador'
            })
        }

        // Solo el autor puede editar
        if (post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para editar esta publicación'
            })
        }

        // Verificar si tiene denuncias pendientes
        const tieneDenuncias = await postTieneDenuncias(postId)

        if (tieneDenuncias) {
            return res.status(403).render('error', {
                msg: 'No podés modificar esta publicación porque tiene denuncias pendientes'
            })
        }

        // Obtener descripción
        const { description } = req.body

        // Actualizar publicación
        await post.update({
            description: description?.trim() || null
        })

        return res.redirect(`/post/${postId}`)

    } catch (error) {

        console.error('Error al actualizar la publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al actualizar la publicación'
        })
    }
}



// POST /post/:postId/eliminar — eliminar una publicación
export async function deletePost(req, res) {

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

        // Solo el autor puede eliminar
        if (post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para eliminar esta publicación'
            })
        }

        // No permitir eliminar publicaciones bloqueadas
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés eliminar una publicación bloqueada por un administrador'
            })
        }

        // Verificar denuncias pendientes
        const tieneDenuncias = await postTieneDenuncias(postId)

        if (tieneDenuncias) {
            return res.status(403).render('error', {
                msg: 'No podés eliminar esta publicación porque tiene denuncias pendientes'
            })
        }

        // Eliminar publicación
        await post.destroy()

        return res.redirect(`/usuario/${userId}`)

    } catch (error) {
        console.error('Error al eliminar la publicación:', error)

        return res.status(500).render('error', {
            msg: 'Error al eliminar la publicación'
        })
    }
}


// Editar un comentario de una imagen
export async function updateComment(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const imageId = Number(req.params.imageId)
    const commentId = Number(req.params.commentId)
    const userId = req.session.user.userid

    const content = req.body.content?.trim()

    try {

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés editar comentarios de una publicación bloqueada'
            })
        }

        // Validar contenido
        if (!content) {
            return res.redirect(`/post/${postId}`)
        }

        // Buscar el comentario
        const comment = await Comment.findByPk(commentId)

        if (!comment) {
            return res.status(404).render('error', {
                msg: 'Comentario no encontrado'
            })
        }

        // Verificar que pertenezca a la imagen y publicación
        if (comment.idImage !== imageId || comment.idPost !== postId) {
            return res.status(400).render('error', {
                msg: 'El comentario no pertenece a esta imagen o publicación'
            })
        }

        // Solo el autor puede editar
        if (comment.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para editar este comentario'
            })
        }

        // Actualizar comentario
        await comment.update({ content })

        return res.redirect(`/post/${postId}`)

    } catch (error) {
        console.error('Error al editar comentario:', error)

        return res.status(500).render('error', {
            msg: 'Error al editar el comentario'
        })
    }
}


// Abrir o cerrar comentarios de una imagen
export async function CloseImageComments(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const imageId = Number(req.params.imageId)
    const userId = req.session.user.userid

    try {

        // Buscar la imagen con su publicación
        const image = await Image.findByPk(imageId, {
            include: [
                {
                    model: Post
                }
            ]
        })

        if (!image) {
            return res.status(404).render('error', {
                msg: 'Imagen no encontrada'
            })
        }

        // Verificar que la imagen pertenezca a la publicación
        if (image.idPost !== postId) {
            return res.status(400).render('error', {
                msg: 'La imagen no pertenece a esta publicación'
            })
        }

        // Verificar que la publicación exista
        if (!image.Post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Verificar si la publicación está bloqueada
        if (image.Post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés modificar los comentarios de una publicación bloqueada'
            })
        }

        // Solo el autor de la publicación puede abrir o cerrar comentarios
        if (image.Post.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para modificar los comentarios de esta imagen'
            })
        }

        // Cambiar el estado de los comentarios
        await image.update({
            comentDisable: !image.comentDisable
        })

        return res.redirect(`/post/${postId}`)

    } catch (error) {

        console.error('Error al cambiar el estado de comentarios:', error)

        return res.status(500).render('error', {
            msg: 'Error al cambiar el estado de los comentarios'
        })
    }
}



// Eliminar un comentario de una imagen
export async function deleteComment(req, res) {

    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const imageId = Number(req.params.imageId)
    const commentId = Number(req.params.commentId)
    const userId = req.session.user.userid

    try {

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).render('error', {
                msg: 'Publicación no encontrada'
            })
        }

        // Verificar si la publicación está bloqueada
        if (post.estadoPublicacion !== 'activa') {
            return res.status(403).render('error', {
                msg: 'No podés eliminar comentarios de una publicación bloqueada'
            })
        }

        // Buscar el comentario
        const comment = await Comment.findByPk(commentId)

        if (!comment) {
            return res.status(404).render('error', {
                msg: 'Comentario no encontrado'
            })
        }

        // Verificar que pertenezca a la imagen y publicación
        if (comment.idImage !== imageId || comment.idPost !== postId) {
            return res.status(400).render('error', {
                msg: 'El comentario no pertenece a esta imagen o publicación'
            })
        }

        // Solo el autor puede eliminar
        if (comment.idUser !== userId) {
            return res.status(403).render('error', {
                msg: 'No tenés permiso para eliminar este comentario'
            })
        }

        // Eliminar comentario
        await comment.destroy()

        return res.redirect(`/post/${postId}`)

    } catch (error) {

        console.error('Error al eliminar comentario:', error)

        return res.status(500).render('error', {
            msg: 'Error al eliminar el comentario'
        })
    }
}



//busqueda por titulo,usuario y tag
export async function searchPosts(req, res) {
    const termino = req.query.termino || ''

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
                    where: req.session.user ? {} : { copyright: false },
                    required: false
                },
                {
                    model: Hashtag
                }
            ],
            where: {
                estadoPublicacion: 'activa',
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${termino}%`
                        }
                    },
                ]
            },
            order: [['createdAt', 'DESC']]
        })

        // Mostrar solamente publicaciones con imágenes visibles
        const postsVisibles = posts.filter(post => post.Images.length > 0)

        const allTags = await fetchAllHashtags()

        let usuariosSeguidos = []

        if (req.session.user) {
            const seguidos = await Follow.findAll({
                where: {
                    followerId: req.session.user.userid
                }
            })

            usuariosSeguidos = seguidos.map(
                seguido => seguido.followingId
            )
        }

        res.render('post', {
            posts: postsVisibles,
            allTags,
            usuariosSeguidos,
            msg: postsVisibles.length ? null : 'No se encontraron publicaciones'
        })

    } catch (error) {
        console.error(error)

        res.status(500).render('error', {
            msg: 'Error al buscar publicaciones'
        })
    }
}



// GET /post/siguiendo — publicaciones de usuarios que sigo
export async function getFollowingPosts(req, res) {

    // Verificar que el usuario inició sesión
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const userId = req.session.user.userid

    try {
        // Obtener los usuarios que sigo
        const seguidos = await Follow.findAll({
            where: {
                followerId: userId
            }
        })

        // Obtener los IDs de los usuarios seguidos
        const usuariosSeguidos = seguidos.map(
            seguido => seguido.followingId
        )

        // Buscar las publicaciones de esos usuarios
        const posts = await Post.findAll({
            where: {
                idUser: {
                    [Op.in]: usuariosSeguidos
                },
                estadoPublicacion: 'activa'
            },
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
                            model: Rating
                        }
                    ]
                },
                {
                    model: Hashtag
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        const allTags = await fetchAllHashtags()

        // Reutilizar la vista de publicaciones
        res.render('post', {
            posts,
            allTags,
            titulo: 'Publicaciones de usuarios que sigo',
            usuariosSeguidos,
            msg: posts.length
                ? null
                : 'Todavía no hay publicaciones de usuarios que seguís'
        })

    } catch (error) {
        console.error('Error al obtener publicaciones de seguidos:', error)

        res.status(500).render('error', {
            msg: 'Error al obtener las publicaciones de usuarios seguidos'
        })
    }
}

