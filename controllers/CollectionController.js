import { Post } from '../models/Post.js'
import { Collection } from '../models/Collection.js'
import { Image } from '../models/Image.js'

// Crear una colección
export async function createCollection(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const { name, description, isPrivate } = req.body

    try {
        await Collection.create({
            name,
            description,
            isPrivate: isPrivate === 'on',
            idUser: req.session.user.userid
        })

        res.redirect('/colecciones')

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al crear la colección')
    }
}

// Mostrar las colecciones del usuario
export async function getCollections(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    try {
        const collections = await Collection.findAll({
            where: {
                idUser: req.session.user.userid
            }
        })

        res.render('collections', {
            collections
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener las colecciones')
    }
}


export async function savePostToCollection(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const postId = Number(req.params.postId)
    const idCollection = Number(req.body.idCollection)
    const idUser = req.session.user.userid

    
    try {
        // Buscar la colección del usuario conectado
        const collection = await Collection.findOne({
            where: {
                id: idCollection,
                idUser: idUser
            }
        })

        if (!collection) {
            return res.status(404).send('Colección no encontrada')
        }

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post || post.estadoPublicacion !== 'activa') {
            return res.status(404).send('Publicación no disponible')
        }

        // Verificar si la publicación ya está guardada
        const guardada = await collection.hasPost(post)

        if (guardada) {
            return res.redirect(`/post/${postId}`)
        }

        // Guardar publicación en la colección
        await collection.addPost(post)

        res.redirect(`/post/${postId}`)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al guardar la publicación')
    }
}


export async function getCollectionById(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const idCollection = Number(req.params.id)
    const idUser = req.session.user.userid

    if (!Number.isInteger(idCollection) || idCollection <= 0) {
        return res.status(400).send('ID de colección inválido')
    }

    try {
        // Buscar la colección del usuario conectado
        const collection = await Collection.findOne({
            where: {
                id: idCollection,
                idUser: idUser
            },
            include: [
                {
                    model: Post,
                    through: { attributes: [] },
                    include: [
                        {
                            model: Image
                        }
                    ]
                }
            ]
        })

        if (!collection) {
            return res.status(404).send('Colección no encontrada')
        }

        res.render('CollectionDetail', {
            collection
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener la colección')
    }
}



export async function removePostFromCollection(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const idCollection = Number(req.params.id)
    const postId = Number(req.params.postId)
    const idUser = req.session.user.userid

    if (!Number.isInteger(idCollection) || idCollection <= 0 ||
        !Number.isInteger(postId) || postId <= 0) {
        return res.status(400).send('ID inválido')
    }

    try {
        // Verificar que la colección pertenezca al usuario
        const collection = await Collection.findOne({
            where: {
                id: idCollection,
                idUser: idUser
            }
        })

        if (!collection) {
            return res.status(404).send('Colección no encontrada')
        }

        // Buscar la publicación
        const post = await Post.findByPk(postId)

        if (!post) {
            return res.status(404).send('Publicación no encontrada')
        }

        // Verificar si está guardada en la colección
        const guardada = await collection.hasPost(post)

        if (!guardada) {
            return res.status(404).send('La publicación no está en esta colección')
        }

        // Eliminar la relación en SavedPosts
        await collection.removePost(post)

        // Volver al detalle de la colección
        res.redirect(`/colecciones/${idCollection}`)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al quitar la publicación')
    }
}


